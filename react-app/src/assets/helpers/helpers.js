// Helper function to remove an entity from a section of the state
export const removeEntityFromSection = (section, entityId) => {
  // console.log("Attempting to remove entity with ID:", entityId);

  if (section.byId[entityId]) {
      delete section.byId[entityId];
      section.allIds = section.allIds.filter(id => id !== entityId);
      // console.log("Successfully removed entity with ID:", entityId);
  } else {
      // console.log("Entity with ID", entityId, "not found in section.");
  }

  return section;
};
