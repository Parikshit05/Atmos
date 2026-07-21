export const quotes = [
  { text: 'The sky is not the limit, it\'s just the view.', author: 'Unknown' },
  { text: 'Every storm runs out of rain.', author: 'Gary Allan' },
  { text: 'The sun himself is weak when he first rises and gathers strength and courage as the day gets on.', author: 'Charles Dickens' },
  { text: 'After every storm, the sun will smile.', author: 'Unknown' },
  { text: 'There is no such thing as bad weather, only different kinds of good weather.', author: 'John Ruskin' },
  { text: 'The sky is an infinite movie to me.', author: 'Larry Niven' },
  { text: 'Wherever you go, no matter what the weather, always bring your own sunshine.', author: 'Dwight L. Moody' },
  { text: 'A change in the weather is sufficient to recreate the world and ourselves.', author: 'Marcel Proust' },
  { text: 'The sky is not just a backdrop; it is a constantly changing masterpiece.', author: 'Unknown' },
  { text: 'Thunder is good, thunder is impressive; but it is lightning that does the work.', author: 'Mark Twain' },
  { text: 'Some people feel the rain. Others just get wet.', author: 'Bob Marley' },
  { text: 'The breeze at dawn has secrets you can\'t yet tell.', author: 'Rumi' },
  { text: 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.', author: 'Rabindranath Tagore' },
  { text: 'Life isn\'t about waiting for the storm to pass; it\'s about learning to dance in the rain.', author: 'Vivian Greene' },
  { text: 'The sky is full of different colors at different times, and you just have to open your eyes to see them.', author: 'Unknown' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Look at everything as though you were seeing it either for the first or last time.', author: 'Betty Smith' },
  { text: 'Nature is painting for us, day after day, pictures of infinite beauty.', author: 'John Ruskin' },
  { text: 'The wind shows us how close to the edge we are.', author: 'Joan Didion' },
  { text: 'Rain is not only blessed water, it is also the tears of the sky.', author: 'Unknown' },
  { text: 'Sunshine is a welcome thing. It brings a lot of brightness.', author: 'Jimmie Davis' },
  { text: 'Every hour of light and dark is a miracle.', author: 'Walt Whitman' },
  { text: 'The air is a ribbon of sky, and the sky is a river of time.', author: 'Unknown' },
  { text: 'What terrible about a storm is not the rain but the calm after it.', author: 'Unknown' },
];

export function getWeatherQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}
