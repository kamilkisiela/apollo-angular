const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const [, , name] = process.argv;

function updateComponent() {
  let filepath = path.join(cwd, `./${name}/src/app/app.component.ts`);
  let code = fs.readFileSync(filepath, 'utf8');

  code = `import { Apollo } from 'apollo-angular';\n` + code;

  code.replace(
    'AppComponent {',
    'AppComponent { constructor(private apollo: Apollo) {}',
  );

  fs.writeFileSync(filepath, code, 'utf8');
}

function updateCypress() {
  let filepath = path.join(cwd, `./${name}/cypress/integration/spec.ts`);
  let code = fs.readFileSync(filepath, 'utf8');

  code.replace(`cy.contains('sandbox app is running!')`, '');

  fs.writeFileSync(filepath, code, 'utf8');
}

updateComponent();
updateCypress();
