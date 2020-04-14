addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */

class TitleRewriter {
  element(ele) {
    ele.setInnerContent("Hi! \n I am Faizan");
  }
}

class LinkRewriter {
  element(ele) {
    ele.setAttribute("href", "https://github.com/mdfaizan7");
    ele.setInnerContent("See my Github Profile");
  }
}

// fetch variants array
async function getVariants(url) {
  const response = await fetch(url, {});
  const json = await response.json();

  return json.variants;
}

// get a random url from the variants array
function getUrl(variants) {
  return variants[Math.floor(Math.random() * variants.length)];
}

// fetch the random url and return the response
async function getResponse(url) {
  const res = await fetch(url);
  const htmlRewriter = new HTMLRewriter()
    .on("h1#title", new TitleRewriter())
    .on("a#url", new LinkRewriter());

  return new Response(htmlRewriter.transform(res).body, res);
}

async function handleRequest(request) {
  const variants = await getVariants(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  );
  const url = getUrl(variants);

  const response = getResponse(url);
  return response;
}
