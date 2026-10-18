const {test,expect}=require('@playwright/test');

test('le mobilier forme des ensembles cohérents sans chevauchements majeurs',async({page})=>{
  await page.goto('/game.html?seed=LAYOUT-COHERENCE');
  const result=await page.evaluate(()=>{
    const byId=id=>MELI_FURNITURE.find(item=>item.id===id);
    const sofa=byId('sofa_main'),coffee=byId('coffee_main'),tv=byId('tv_main'),rug=byId('rug_main');
    const alignment=[sofa,coffee,tv,rug].every(item=>Math.abs(item.p[0]-sofa.p[0])<.05);
    const viewingOrder=tv.p[2]<coffee.p[2]&&coffee.p[2]<sofa.p[2];
    const overlaps=[];
    const solids=MELI_FURNITURE.filter(item=>item.solid);
    for(let i=0;i<solids.length;i++)for(let j=i+1;j<solids.length;j++){
      const a=solids[i],b=solids[j];if(a.room!==b.room)continue;
      const x=Math.abs(a.p[0]-b.p[0])<(a.s[0]+b.s[0])*.48;
      const y=Math.abs(a.p[1]-b.p[1])<(a.s[1]+b.s[1])*.48;
      const z=Math.abs(a.p[2]-b.p[2])<(a.s[2]+b.s[2])*.48;
      if(x&&y&&z)overlaps.push([a.id,b.id]);
    }
    return{alignment,viewingOrder,overlaps,tv:tv.p,sofa:sofa.p};
  });
  expect(result.alignment).toBeTruthy();
  expect(result.viewingOrder).toBeTruthy();
  expect(result.overlaps).toEqual([]);
  expect(result.tv[2]).toBeLessThan(result.sofa[2]);
});

test('les meubles détaillés regardent leur zone d’usage et restent dans leur pièce',async({page})=>{
  await page.goto('/game.html?seed=ORIENTATION');
  const result=await page.evaluate(()=>{
    const byId=id=>MELI_FURNITURE.find(item=>item.id===id);
    const expected={sofa_main:'north',tv_main:'south',bookcase_main:'north',wardrobe_main:'east',fridge_main:'west',desk_main:'south',vanity_main:'south',wc_main:'north'};
    const wrongFacing=Object.entries(expected).filter(([id,facing])=>byId(id)?.facing!==facing);
    const outside=MELI_FURNITURE.filter(item=>{
      const room=MELI_ROOM_ZONES.find(zone=>zone.id===item.room);if(!room)return false;
      return Math.abs(item.p[0]-room.p[0])>room.s[0]/2+.2||Math.abs(item.p[2]-room.p[2])>room.s[2]/2+.2;
    }).map(item=>item.id);
    return{wrongFacing,outside,sofaRotation:window.__MELI_TEST__.furnitureRotation('sofa_main'),tvRotation:window.__MELI_TEST__.furnitureRotation('tv_main')};
  });
  expect(result.wrongFacing).toEqual([]);
  expect(result.outside).toEqual([]);
  expect(Math.abs(result.sofaRotation-Math.PI)).toBeLessThan(.001);
  expect(Math.abs(result.tvRotation)).toBeLessThan(.001);
});
