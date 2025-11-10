import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

jest.setTimeout(60000);

const featureSlices = ['attendance', 'events', 'classes', 'students', 'teachers'];

describe('Architecture – Vertical Slice', () => {
  featureSlices.forEach(slice => {
    featureSlices.filter(o => o !== slice).forEach(other => {
      it(`${slice} should not depend on ${other}`, async () => {
        const rule = filesOfProject()
          .inFolder(`src/features/${slice}`)
          .shouldNot()
          .dependOnFiles()
          .inFolder(`src/features/${other}`);
        await expect(rule).toPassAsync();
      });
    });
  });

  featureSlices.forEach(slice => {
    it(`${slice} slice should be cycle free`, async () => {
      const rule = filesOfProject()
        .inFolder(`src/features/${slice}`)
        .should()
        .beFreeOfCycles();
      await expect(rule).toPassAsync();
    });
  });

  it('controllers should not import other controllers', async () => {
    const rule = filesOfProject()
      .matchingPattern('src/features/(.+)/controller.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('src/features/(.+)/controller.ts');
    await expect(rule).toPassAsync();
  });

  it('use cases should not depend on controllers', async () => {
    const rule = filesOfProject()
      .matchingPattern('src/features/(.+)/useCase.ts')
      .shouldNot()
      .dependOnFiles()
      .matchingPattern('src/features/(.+)/controller.ts');
    await expect(rule).toPassAsync();
  });

  it('shared layer should not depend on features', async () => {
    const rule = filesOfProject()
      .inFolder('src/shared')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/features');
    await expect(rule).toPassAsync();
  });

  it('interface should not depend on deprecated folders', async () => {
    const deprecated = ['src/app', 'src/core'];
    for (const dep of deprecated) {
      const rule = filesOfProject()
        .inFolder('src/interface')
        .shouldNot()
        .dependOnFiles()
        .inFolder(dep);
      await expect(rule).toPassAsync();
    }
  });
});
