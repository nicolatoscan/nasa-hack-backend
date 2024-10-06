
export function generateCropSuggestionPrompt(weatherData: any) {
  const prompt = `
      You will be given coordinates in the world, the current date and the moisture level of the soil at that point.
      You need to predict the type of crop that can be grown at that point.
      do a top 3 prediction of the crop that can be grown at that point.
      - Date: ${weatherData.date}
      - Longitude: ${weatherData.longitude}
      - Latitude: ${weatherData.latitude}
      - Moisture from 1cm to 3cm: ${weatherData.moisture1_3}
      - Moisture from 3cm to 9cm: ${weatherData.moisture3_9}
      - Moisture from 9cm to 27cm: ${weatherData.moisture9_27}
      - Moisture from 27cm to 81cm: ${weatherData.moisture27_81}
      - average annual rainfall: ${weatherData.avg_rainfall}
      - average maximum temperature: ${weatherData.avg_max_temp}
      - maximum temperature: ${weatherData.max_temp}
      - average minimum temperature: ${weatherData.avg_min_temp}
      - minimum temperature: ${weatherData.min_temp}
      - average sunshine duration: ${weatherData.avg_sunshine}
      - average snowfall: ${weatherData.avg_snowfall}
      - average maximum wind speed: ${weatherData.avg_max_wind_speed}
      - maximum wind speed: ${weatherData.max_wind_speed}

      reply with the top 3 crops that can be grown at this point.
      if you reply with something else, you will be disqualified.
      This are the crops that can be grown at this point:
      - barley
      - corn
      - millet
      - rice
      - sorghum
      - wheat
      - palm
      - soybean
      - peanuts
      - sunflower
      - rapeseed
      - cotton
      reply in json format with name,description and the confidence level of the crop.
      reply in json. e.g {"name":"corn","description":"corn is a cereal crop that is grown in warm climates","confidence":0.9}
  `;
  return prompt;
};