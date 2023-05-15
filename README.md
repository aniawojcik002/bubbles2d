# bubbles2d

Aplikację uruchamia się za pomocą komendy: npm run dev (Vite) 

Stack technologiczny: 
React,
React Three Fiber,
React Drei,
Three. js (Math.Utills, tylko do wizualizacji, w funkcja do generowania randomowego koloru piłeczki)


Napotkane problemy: 
-> kulki podczas odbicia wzajemnego nachodzą na siebie i podczas kolejnych frame'ów łączą się i poruszają się razem: Problem rozwiązano korygując pozycję jednej z piłek przez wyznaczeniem ich pozycji po odbiciu tak aby nie nachodziła na piłkę 2.
-> kulki po odbiciu od okręgu wychodzą poza okręg: Problem rozwiązano korekcją pozycji piłki po odbiciu od okręgu, aby piłeczki zostawały w nim.

Największym wyzwaniem dla mnie w tym zadaniu była komunikacja między komponentem rodzicem, w tym wypadku Bubbles i dzieckiem Bubble, tak aby przekazywać aktualne pozycję i prędkość z komponentu Bubble do Bubbles.
W tym celu wykorzystano hook useImperativeHandle. 

Dalszą możliwością rozwijania rozwiązania jest wykorzystanie quadtree algotrytmu.
