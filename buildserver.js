import esbuild from 'esbuild';
import http from 'http';
import fileSystem from 'fs-extra';
import path from 'path';
import childProcess from 'child_process';
import mimeTypes from 'mime-types';

const indexTemplatePath = './public/index.template';
const publicDir = './public';

let indexHtml = fileSystem.readFileSync(indexTemplatePath, { encoding: 'utf-8' });
indexHtml = indexHtml.replace(/%INDEX_JS%/g, 'index.js').replace(/%INDEX_CSS%/g, 'index.css');

let build = {};
const refreshPollers = [];
function triggerRefresh() {
  refreshPollers.forEach((response) => {
    response.writeHead(204).end();
  });
  refreshPollers.length = 0;
}

fileSystem.watch(publicDir, { recursive: true }, triggerRefresh);

function fixPaths(basePath, path) {
  // path will be a relative path in Unix, but absolute in Windows.
  // We cut off the base path if required, and also replace (escaped) Windows separators.
  if (path.startsWith(basePath)) {
    path = path.substring(basePath.length);
  }
  path = path.replaceAll('\\', '/');

  return path;
}

esbuild
  .build({
    entryPoints: ['src/index.js'],
    entryNames: '[name]',
    assetNames: 'images/[name]',
    bundle: true,
    loader: {
      '.js': 'jsx',
    },
    banner: {},
    sourcemap: true,
    splitting: true,
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error);
        } else {
          console.log('watch build succeeded');
          build = {};
          const basePath = process.cwd();
          for (let item of result.outputFiles) {
            const path = fixPaths(basePath, item.path);
            build[path] = item.contents;
          }
          triggerRefresh();
        }
      },
    },
    target: ['es2020'],
    outdir: '/client',
    format: 'esm',
    metafile: true,
    write: false,
    logLevel: 'info',
  })
  .then((result) => {
    const basePath = process.cwd();
    for (let item of result.outputFiles) {
      const path = fixPaths(basePath, item.path);
      build[path] = item.contents;
    }

    http
      .createServer(function (request, response) {
        let filePath = request.url;
        if (filePath.endsWith('js')) console.log('requesting', filePath);
        if (filePath === '/reload') {
          refreshPollers.push(response);
        } else if (filePath === '/cytest/index.html') {
          console.log('filePath:', filePath);
          console.log('supposed to handle cypress...');
          // const clientScript = fileSystem.readFileSync('cypress/support/client-script.js', {
          //   encoding: 'utf-8',
          // });

          const contentToServe = indexHtml.replace(
            '<div id="root"></div>',
            `<div id="root"></div>
            <div data-cy-root></div>`
          );
          //<script type="module">${clientScript}</script>`
          response
            .writeHead(200, {
              'Content-Type': 'text/html',
            })
            .end(contentToServe);
        } else if (filePath === '/cytest/src/components/Welcome.cy.js') {
          response
            .writeHead(200, {
              'Content-Type': 'text/javascript',
            })
            .end(fileSystem.readFileSync('src/components/Welcome.cy.js', { encoding: 'utf-8' }));
        } else if (filePath === '/cytest/cypress/support/component.js') {
          response
            .writeHead(200, {
              'Content-Type': 'text/javascript',
            })
            .end(fileSystem.readFileSync('cypress/support/component.js', { encoding: 'utf-8' }));
        } else {
          // build artefact
          const contents = build[filePath];
          if (contents) {
            response
              .writeHead(200, {
                'Content-Type': mimeTypes.lookup(filePath),
              })
              .end(Buffer.from(contents));
          } else {
            // check static file
            filePath = filePath.substring('/client'.length);
            const resolvedPath = path.join('./public', filePath);

            if (fileSystem.existsSync(resolvedPath) && fileSystem.lstatSync(resolvedPath).isFile()) {
              response.writeHead(200, {
                'Content-Type': mimeTypes.lookup(filePath),
              });

              const readStream = fileSystem.createReadStream(resolvedPath);
              readStream.pipe(response);
            } else {
              response
                .writeHead(200, {
                  'Content-Type': 'text/html',
                })
                .end(indexHtml);
            }
          }
        }
      })
      .listen(3000, () => {
        console.log('Serving from http://localhost:3000 ...');
        if (process.platform === 'win32') {
          childProcess.execSync('start http://localhost:3000');
        } else {
          childProcess.execSync('open http://localhost:3000');
        }
      });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
