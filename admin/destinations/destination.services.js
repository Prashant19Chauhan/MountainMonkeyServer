export const embeddingString = (data) => {
  return `
  ${data.name} is a ${data.placeType} in ${data.location.city}, ${data.location.state}, ${data.location.country}.

  ${data.description}

  It is known for ${data.categories?.join(", ")}.

  This destination is ${data.aiMetadata?.mood?.join(", ")} and suitable for ${data.aiMetadata?.suitableFor?.join(", ")} travelers.

  Travel style: ${data.aiMetadata?.travelStyle?.join(", ")}.

  Highlights include ${data.aiMetadata?.highlights?.map(h => h.title).join(", ")}.
  `;
};