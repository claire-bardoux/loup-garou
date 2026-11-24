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
  await page.getByRole('button', { name: 'Passer au joueur suivant' }).click();

  for (let playerNumber = 2; playerNumber <= 14; playerNumber += 1) {
    await expect(page.getByRole('heading', { name: `Joueur n°${playerNumber}, choisis ta carte !` })).toBeVisible();
    await page.getByRole('button', { name: /Choisir une carte, numéro/ }).first().click();
    await page.getByLabel('Nom du joueur').fill(`Joueur ${playerNumber}`);
    await page.getByRole('button', { name: 'Découvrir le rôle' }).click();

    if (playerNumber < 14) {
      await page.getByRole('button', { name: 'Passer au joueur suivant' }).click();
    } else {
      await expect(page.getByRole('heading', { name: 'Joueur 14, tu es' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'La partie va commencer' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Terminer' }).click();
      await expect(page.getByRole('heading', { name: 'La partie va commencer' })).toBeVisible();
    }
  }
});

test('une composition manuelle de 16 joueurs affiche toutes les cartes après Suivant', async ({ page }) => {
  await page.goto('/game-setup');
  for (let player = 13; player < 16; player += 1) {
    await page.getByRole('button', { name: 'Ajouter un joueur' }).click();
  }
  await page.getByRole('link', { name: 'Créer ma composition' }).click();

  await page.getByRole('button', { name: 'Village', exact: true }).click();
  for (let role = 0; role < 13; role += 1) {
    await page.getByRole('button', { name: 'Ajouter un Simple Villageois' }).click();
  }
  await page.getByRole('button', { name: 'Loups', exact: true }).click();
  for (let role = 0; role < 3; role += 1) {
    await page.getByRole('button', { name: 'Ajouter un Loup-Garou' }).click();
  }
  await page.getByRole('button', { name: 'Valider la composition' }).click();

  await expect(page).toHaveURL(/role-summary/);
  await page.locator('.summary-screen').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await page.getByRole('button', { name: 'Suivant' }).click();

  await expect(page.getByRole('heading', { name: 'Joueur n°1, choisis ta carte !' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Choisir une carte, numéro/ })).toHaveCount(16);
  const firstCard = page.getByRole('button', { name: 'Choisir une carte, numéro 1', exact: true });
  await expect(firstCard).toBeInViewport();
  await firstCard.click();
  await expect(page.getByRole('dialog', { name: 'Nouveau joueur' })).toBeVisible();
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
    if (route === '/') {
      const title = await page.getByRole('heading', { name: 'Le Grimoire' }).boundingBox();
      const button = await page.getByRole('link', { name: 'Créer une partie' }).boundingBox();
      const library = await page.getByRole('link', { name: 'Ouvrir la bibliothèque des rôles' }).boundingBox();
      expect(title).not.toBeNull();
      expect(button).not.toBeNull();
      expect(library).not.toBeNull();
      expect(title!.height).toBeLessThanOrEqual(110);
      expect(button!.height).toBeLessThanOrEqual(64);
      expect(library!.height).toBeLessThanOrEqual(52);
      expect(button!.y - (title!.y + title!.height)).toBeGreaterThanOrEqual(40);
    }
  }
});
