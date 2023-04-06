# Zadanie rekrutacyjne 3deling

Prosta symulacja odbijania się kulek.
Kulki odbijają się od ściany koła, jak i między sobą. W nawiązaniu do filmu przykładowego, kulki obijają się między sobą tylko jeśli sąw tym samym kolorze.
Projekt stworzony za pomocą create-react-app, wykorzystane technologie: React, @React-three/fiber, Three js

## Przeszkoda 1: 

Podczas realizacji zadania pierwszą trudnością do pokonania było znalezienie kątu pod jakim kulka powinna się odbić od ściany dużego koła. Sam ką odbicia można policzyć na wiele sposobów, ja zdecydowałem się na skorzystanie ze wzoru korzystającego ze współczynników kierunkowych prostych. To rozwiązanie ma jedną wadę: jeżeli wektor prędkości kulki jest skierowany prosto w dół, kulka zawsze odbije się pionowo do góry. Idealnym rozwiązaniem byłoby skorzystanie ze wzoru na kąt zawarty między wektorami, natomist niestety nie udało mi się znaleźć warunku kiedy należałoby obracać wektor zgodnie ze wskazówkami zegara, lub przeciwnie.

## Przeszkoda 2:

Kolejnym problemem był 'clipping', zdarza się że kulka zanim odbije się od ściany lub innej kulki, 'wejdzie' w nią. Problem udało się rozwiązać w przypadku kolizji ze ścianą, w przypadku zderzeń między kulkami dalej się pojawia (można zauważyć że kulki się 'sklejają').

## Przeszkoda 3:

Kulki spawnują się blisko siebie, co powoduje badzo dużo clippingu. Problem został pominięty odblokowując możliwość zderzeń między kulkami dopiero po jakiś czasie od startu symulacji.