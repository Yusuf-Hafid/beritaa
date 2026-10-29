// Allow side-effect imports of global stylesheets (e.g. `import './globals.css'`).
declare module '*.css' {
  const styles: { readonly [key: string]: string };
  export default styles;
}
