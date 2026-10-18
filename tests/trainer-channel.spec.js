const{test,expect}=require('@playwright/test');

test('le canal formateur normalise le code en quatre lettres maximum',async({page})=>{
  await page.goto('/trainer.html');
  const values=await page.evaluate(()=>{
    const long=new MeliTrainerChannel('ab-12cdef');
    const empty=new MeliTrainerChannel('');
    const result={long:long.code,empty:empty.code,longName:long.name};
    long.close();empty.close();return result;
  });
  expect(values.long).toBe('ABCD');
  expect(values.empty).toBe('MELI');
  expect(values.longName).toBe('meli-trainer-ABCD');
});
