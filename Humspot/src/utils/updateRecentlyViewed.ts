import { Preferences } from "@capacitor/preferences";

type RecentlyViewed = {
  id: string;
  name: string;
  description: string;
  date: string;
  photoUrl: string;
};

export const updateRecentlyViewed = async (id: string, name: string, description: string, date: string, photoUrl: string) => {
  const result = await Preferences.get({ key: "recentlyViewed" });
  let prefArr: RecentlyViewed[] = [];

  if (result.value) {
    prefArr = JSON.parse(result.value);
  }

  const item = { id: id, name: name, description: description, date: date, photoUrl: photoUrl };

  // Check if the id already exists in the array and remove it
  const existingIndex = prefArr.findIndex(e => e.id === item.id);
  if (existingIndex !== -1) {
    prefArr.splice(existingIndex, 1);
  }

  // Push the new id onto the array
  prefArr.push(item);

  // Ensure the array doesn't exceed 10 items
  if (prefArr.length > 10) {
    prefArr.shift(); // Remove the oldest item (first item in the array)
  }

  console.log(prefArr);

  await Preferences.set({ key: "recentlyViewed", value: JSON.stringify(prefArr) });
}
