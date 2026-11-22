import { expect, test } from '@playwright/test';

test('accueil, bibliothèque, recherche et filtre par équipe', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /grimoire/i }).first()).toBeVisible();
  await page.goto('/role-library');
  await expect(page.getByText('Voyante', { exact: true }).first()).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Rechercher un rôle' });
  await search.fill('voyante');
  await expect(page.getByText('Simple villageois', { exact: true })).toHaveCount(0);
  await search.fill('');
  await page.getByRole('button', { name: 'Loups' }).click();
  await expect(page.getByText('Loup-Garou', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Voyante', { exact: true })).toHaveCount(0);
});

test('configuration, résumé et distribution des rôles', async ({ page }) => {
  await page.goto('/game-setup');
  await expect(page.getByRole('heading', { name: 'Paramétrage' })).toBeVisible();
  await page.getByRole('button', { name: 'Ajouter un joueur' }).click();
  await expect(page.locator('output')).toHaveText('14');
  await page.getByLabel('Niveau de jeu').selectOption('decouverte');
  await page.getByRole('link', { name: /Choisir cette composition/ }).click();
  await expect(page).toHaveURL(/role-summary/);
  await expect(page.getByText('14 joueurs')).toBeVisible();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await expect(page.getByRole('heading', { name: 'Joueur n°1, choisis ta carte !' })).toBeVisible();
  await page.getByRole('button', { name: 'Choisir une carte, numéro 1', exact: true }).click();
  await page.getByLabel('Nom du joueur').fill('Camille');
  await page.getByRole('button', { name: 'Découvrir le rôle' }).click();
  await expect(page.getByRole('heading', { name: 'Camille, tu es' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Passer au joueur suivant' })).toBeVisible();
});

test('la page reste dans la largeur sur mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['/', '/game-setup', '/role-library', '/game-play']) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `débordement horizontal sur ${route}`).toBeLessThanOrEqual(dimensions.viewport);
  }
});
