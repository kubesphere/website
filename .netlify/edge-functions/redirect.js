export default async (req, context) => {
  const { url } = req;
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;
  const regex = /^(\/zh\/docs|\/docs)\/v[0-9]+\.[0-9]+.*$/;

  if (regex.test(path)) {
    return;
  } else {
    let hasContentAfterDocs = false;
    const newPath = path.replace(/(\/docs\/)(.*)$/, (match, p1, p2) => {
      if (p2.trim() === "") {
        return `${p1}v3.4/`;
      } else {
        hasContentAfterDocs = true;
        return `${p1}v3.4/${p2}`;
      }
    });

    const redirectStatusCode = hasContentAfterDocs ? 301 : 302;
    const redirectUrl = new URL(newPath, req.url);
    return Response.redirect(redirectUrl, redirectStatusCode);
  }
};
