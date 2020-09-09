# Help

## Sample usage

```javascript
var help = require('u-help');

help.show('feed <animal> <food>','Keep your pet fed!',{
  Animals: {
    whiskers: 'Your beloved cat',
    snout: 'Your loyal dog',
    scales: 'Your awesome fish',
    feathers: 'Your annoying bird',
    toothy: 'Your good old rodent'
  },
  Foods: {
    meat: 'Carnivores\' favourite food',
    fish: 'That weird thing which inhabits seas',
    bones: 'These are under your skin, you know?',
    fishbones: [
      'Fish would be the perfect food without them,',
      'it\'s a real shame they exist'
    ],
    worms: 'Tasty little insects'
  }
});
```

```

 ·----------------------·
 | feed <animal> <food> |
 ·----------------------·

Keep your pet fed!

Animals:

  whiskers   Your beloved cat
  snout      Your loyal dog
  scales     Your awesome fish
  feathers   Your annoying bird
  toothy     Your good old rodent

Foods:

  meat        Carnivores' favourite food
  fish        That weird thing which inhabits seas
  bones       These are under your skin, you know?
  fishbones   Fish would be the perfect food without them,
              it's a real shame they exist
  worms       Tasty little insects

```
