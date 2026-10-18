const {test,expect}=require('@playwright/test');

const textures=['oak-parquet','ceramic-tile','plaster-wall','woven-fabric','geometric-rug','terrazzo'];

test('les textures image optimisées sont livrées et chargées dans la scène 3D',async({page,request})=>{
  for(const name of textures){
    const response=await request.get(`/assets/textures/${name}.webp`);
    expect(response.ok(),name).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/webp');
    expect((await response.body()).length,name).toBeGreaterThan(20_000);
  }
  await page.goto('/game.html?seed=TEXTURES');
  await expect.poll(()=>page.evaluate(()=>window.__MELI_TEST__?.loadedImageTextures),{timeout:15_000}).toBe(7);
  const architecture=await page.evaluate(()=>window.__MELI_TEST__.architecture);
  expect(architecture.imageTextures).toBe(7);
});
