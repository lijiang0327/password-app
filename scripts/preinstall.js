if (!/pnpm/.test(process.env.npm_execpath || '')) {
    console.log('please use pnpm manage pcakages');

    process.exit(1);
}