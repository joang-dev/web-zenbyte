import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './chunks/astro/server_C9uq369b.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/joang/Desktop/web-zenbyte/","adapterName":"@astrojs/netlify","routes":[{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"departments/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/departments","isIndex":false,"type":"page","pattern":"^\\/departments\\/?$","segments":[[{"content":"departments","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/departments.astro","pathname":"/departments","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"pricing/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/pricing","isIndex":false,"type":"page","pattern":"^\\/pricing\\/?$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/joang/Desktop/web-zenbyte/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/Users/joang/Desktop/web-zenbyte/src/pages/departments.astro",{"propagation":"none","containsHead":true}],["C:/Users/joang/Desktop/web-zenbyte/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/joang/Desktop/web-zenbyte/src/pages/pricing.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/departments@_@astro":"pages/departments.astro.mjs","\u0000@astro-page:src/pages/pricing@_@astro":"pages/pricing.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_JjZ_tKNg.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/funders/aaron-funder.json":"chunks/aaron-funder_BgsJAhSI.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/funders/andrea-funder.json":"chunks/andrea-funder_Bwzo93sM.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/funders/joan-funder.json":"chunks/joan-funder_DUe7KS1t.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/departments/finances.json":"chunks/finances_BVu-yBRe.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/departments/marketing.json":"chunks/marketing_DHeY8JnP.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/departments/production.json":"chunks/production_m8kMG8Ot.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/departments/rh.json":"chunks/rh_6JjaOtVB.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/pricing-options/monthly.json":"chunks/monthly_CEGwt48A.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/pricing-options/trimestral.json":"chunks/trimestral_DfMAWDRE.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/pricing-options/try.json":"chunks/try_ga-XV9Qh.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/pricing-options/yearly.json":"chunks/yearly_Nz8E7AcN.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/feature-sections/duration.json":"chunks/duration_dyMpNtri.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/feature-sections/location.json":"chunks/location_FDUjezbv.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/feature-sections/programming.json":"chunks/programming_4wzBQQ7B.mjs","C:/Users/joang/Desktop/web-zenbyte/src/data/feature-sections/sports.json":"chunks/sports_BHAWi8DO.mjs","C:/Users/joang/Desktop/web-zenbyte/src/components/MenuIcon.astro?astro&type=script&index=0&lang.ts":"_astro/MenuIcon.astro_astro_type_script_index_0_lang.Bk1dujIn.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/joang/Desktop/web-zenbyte/src/components/MenuIcon.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"menu-icon\"),n=document.getElementById(\"page-navigation\");e&&n&&e.addEventListener(\"click\",()=>{n.classList.toggle(\"show\")});"]],"assets":["/_astro/about.s7OCEM95.css","/zenbyte-favicon.webp","/zenbyte-logo.webp","/instagram_content/contact-info.webp","/instagram_content/girl.webp","/instagram_content/playground.webp","/instagram_content/principal-publish.webp","/instagram_content/zen-coder.webp","/offer-img/galicia.webp","/offer-img/javascript.webp","/offer-img/meditation.webp","/offer-img/pricing.webp","/about/index.html","/departments/index.html","/pricing/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"sXi82+d1whZzXfPnwd+eG1Eubp9oKNVzfyoLUGyjrEk=","envGetSecretEnabled":true});

export { manifest };
