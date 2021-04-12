const babel = require('@babel/core');
const preset = require('./index');

test('ts files should be compiled', () => {
  const config = {
    filename: 'test.ts',
    presets: [preset],
  };
  const { code } = babel.transformSync('const a:number=0', config);

  expect(code).toMatch(/var a = 0/);
});

test('jsx files should be compiled', () => {
  const config = {
    filename: 'test.jsx',
    presets: [preset],
  };
  const { code } = babel.transformSync(
    `const Hi=({name})=>{return <p>hi {name}</p>};
     const App=()=>{const name="App";return <Hi name={name}></Hi>;}`,
    config
  );

  expect(code).toMatch(/React.createElement/);
});
