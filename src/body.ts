export function getColorBody(latitude: number, longitude: number, size: number = 0.005): any {
  function setup() {
    return {
      input: ["B02", "B03", "B04"],
      output: { bands: 3 }
    };
  }
  
  function evaluatePixel(sample: any) {
    return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
  }

  return createRequestBody(latitude, longitude, setup, evaluatePixel, size)
}

export function getMoisture(latitude: number, longitude: number, size: number = 0.005): any {
  function setup() {
    return {
      input: ["B8A", "B11", "B04"],
      output: { bands: 3 }
    };
  }
  
  function evaluatePixel(sample: any) {
    return [0,0,2.5 * ((sample.B8A-sample.B11)/(sample.B8A+sample.B11))];
  }

  return createRequestBody(latitude, longitude, setup, evaluatePixel, size)
}

export function getVegetation(latitude: number, longitude: number, size: number = 0.005): any {
  function setup() {
    return {
      input: ["B8A", "B04", "B02"],
      output: { bands: 3 }
    };
  }
  
  function evaluatePixel(sample: any) {
    return [0,2.5 * ((sample.B8A - sample.B04) / (sample.B8A + 6 * sample.B04 - 7.5 * sample.B02 + 1)),0];
  }

  return createRequestBody(latitude, longitude, setup, evaluatePixel, size)
}

export function getReflectance(latitude: number, longitude: number, size: number = 0.005): any {
  function setup() {
    return {
      input: ["B11", "B8A", "B04"],
      output: { bands: 3 }
    };
  }
  
  function evaluatePixel(sample: any) {
    return [2.5 * sample.B11, 2.5 * sample.B8A, 2.5 * sample.B04];
  }

  return createRequestBody(latitude, longitude, setup, evaluatePixel, size)
}




export function createRequestBody(latitude: number, longitude: number, setup: () => any, evaluatePixel: (sample: any) => any, size: number = 0.005) {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // round to six decimals
  latitude = Math.round(latitude * 1e6) / 1e6
  longitude = Math.round(longitude * 1e6) / 1e6

  const body =  {
    "input": {
      "bounds": {
        "bbox": [
          longitude - 0.005,
          latitude - 0.0025,
          longitude + 0.005,
          latitude + 0.0025
        ]
      },
      "data": [
        {
          "dataFilter": {
            "timeRange": {
              "from": oneMonthAgo.toISOString(),
              "to": today.toISOString()
            },
            "mosaickingOrder": "leastCC"
          },
          "type": "sentinel-2-l2a"
        }
      ]
    },
    "output": {
      "width": 512,
      "height": 256,
      "responses": [
        {
          "identifier": "default",
          "format": {
            "type": "image/jpeg"
          }
        }
      ]
    },
    // "evalscript": "//VERSION=3\n\nfunction setup() {\n  return {\n    input: [\"B02\", \"B03\", \"B04\"],\n    output: { bands: 3 }\n  };\n}\n\nfunction evaluatePixel(sample) {\n  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];\n}"
    "evalscript": `//VERSION=3\n\n${setup.toString()}\n\n${evaluatePixel.toString()}`
  }

  return body
}
