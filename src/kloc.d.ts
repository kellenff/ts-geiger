declare module "kloc" {
  function count(path: string): Promise<number>;

  export default count;
}
