const {test,expect}=require('@playwright/test');

test('les pièces utilisent des textures image et des détails de matière',async({page})=>{
  await page.goto('/game.html?seed=TEXTURE-DETAIL');
  const detail=await page.evaluate(()=>({
    furniture:MELI_FURNITURE.length,
    kinds:[...new Set(MELI_FURNITURE.map(item=>item.kind))],
    proceduralParts:Object.values(MELI_SKIN_PARTS).reduce((sum,parts)=>sum+parts.length,0),
    rendered:window.__MELI_TEST__.renderedObjects
  }));
  expect(detail.furniture).toBeGreaterThanOrEqual(27);
  expect(detail.kinds).toEqual(expect.arrayContaining(['backsplash','wallart','curtain','towel','radiator','lamp']));
  expect(detail.proceduralParts).toBeGreaterThan(80);
  expect(detail.rendered).toBeGreaterThan(detail.furniture*3);
});
