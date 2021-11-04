/**
 * Default Routes
 * @type {{post: string, profile: string, discussion: string, category: string, status: string}}
 */
export const defaultRoutes = {
  category: '/category/:id/',
  profile: '/user/:id/',
  post: '/post/:id/',
  status: '/post/:id/',
  discussion: '/discussion/:id/:slug/',
};
