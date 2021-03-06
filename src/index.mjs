import get from "simple-get";

// checks if the request is 2xx--e.g., 200, 201, etc.
const isSuccessful = /2\d{2}/;

export async function nodeProvider(opts, iterations = 0, config, url) {
  try {
    config.cancel = { abort: () => {} };
    const request = await new Promise((resolve, reject) => {
      get.concat(opts, function (err, res, data) {
        if (err || !isSuccessful.test(res.statusCode.toString())) {
          reject(err || res.statusCode);
        } else {
          resolve({
            status: res.statusCode,
            data: config.dataExtractor(data)
          });
        }
      });
    });
    return request;
  } catch (error) {
    if (shouldCheckRefreshToken(error, iterations, config)) {
      const newOpts = await tryRefreshToken(opts, config, url);
      return nodeProvider(newOpts, 1, config);
    } else {
      throw new Error(error);
    }
  }
}

function shouldCheckRefreshToken(statusCode, iterations, config) {
  return statusCode === 401 && iterations === 0 && config.hasRefresh();
}

async function tryRefreshToken(opts, config, url) {
  await config.refresh();
  const customPath = config.path.hasOwnProperty(url);
  const options = customPath && customPath.options || config.options;
  return {
    ...opts,
    headers: options.headers
  };
}
