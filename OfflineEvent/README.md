### Favicon image replacement
An example of how to replace a favicon page. When triggered "online" event (almost instantly) standard favicon will be replaced by green.
When triggered "offline" event-red. 
Pay attention to the format of the link to the offline image. Unfortunately,
the query works only with this format (should start with `data:image/png;base64`...). Favicon for online events can have a simple url link.
