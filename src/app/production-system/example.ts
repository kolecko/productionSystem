export const familyRelations = {
  facts: [
    'Peter je rodic Jano',
    'Peter je rodic Vlado',
    'manzelia Peter Eva',
    'Vlado je rodic Maria',
    'Vlado je rodic Viera',
    'muz Peter',
    'muz Jano',
    'muz Vlado',
    'zena Maria',
    'zena Viera',
    'zena Eva'
  ],
  rules: [{
    name: 'Druhý rodič 1',
    condition: '$x je rodic $y ^ manzelia $x $z',
    action: 'pridat $z je rodic $y'
  }, {
    name: 'Druhý rodič 2',
    condition: '$x je rodic $y ^ manzelia $z $x',
    action: 'pridat $z je rodic $y'
  }, {
    name: 'Otec',
    condition: '$X je rodic $Y ^ muz $X',
    action: 'pridat $X je otec $Y'
  }, {
    name: 'Matka',
    condition: '$X je rodic $Y ^ zena $X',
    action: 'pridat $X je matka $Y'
  }, {
    name: 'Súrodenci',
    condition: '$X je rodic $Y ^ $X je rodic $Z ^ <> $Y $Z',
    action: 'pridat $Y a $Z su surodenci'
  }, {
    name: 'Brat',
    condition: '$Y a $Z su surodenci ^ muz $Y',
    action: 'pridat $Y je brat $Z'
  }, {
    name: 'Strýko',
    condition: '$Y je brat $Z ^ $Z je rodic $X',
    action: 'pridat $Y je stryko $X & vypisat $X ma stryka'
  }, {
    name: 'Test mazania',
    condition: '$Y je stryko $X ^ zena $X',
    action: 'vymazat zena $X'
  }]
};
