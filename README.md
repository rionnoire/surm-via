# surm-via

kasutamine!

## andmete saamine
csv fetchimiseks mine lingile rionnoire.github.io/surm-via/move.csv, lisandeid pole vaja
trust me see pole raske

csv on avalik, formaadis from/to/capture?/timestamp, from/to on lauapositsioonid tavanotatsioonis, capture on yes/no

!!! laud on 4x4, inimvastase käike EI ARVUTATA.

iga uus käik overwrite'ib eelmise! 

## kirjutamine

kirjutamiseks on vaja vastavat personal access tokenit, mille peab sisestama lehel olevasse input fieldi. kui tokenit ei ole, ei saa leht csv-sse kirjutada ja käike ei salvestata.

kirjutamine võtab veidi aega, git pole kõige kiirem hobune rajal, kuid protsess ei peaks üle kahe minuti võtma. vajadusel saab manuaalselt csv avada ja kontrollida, kas faili on hiljuti kirjutatud. 

### kaamerast lugemine

kasutab telefoni vms tagakaamerat kui saab, vajab loomulikult browseri kaamerapermissioneid
töötaval streamil saab croppida valikala, soovituslik sest feed võiks olla ruudukujuline.
"KAAMERA" aktiveerib kaamera, "CAPTURE" teeb pildi. 

lauatuvastust saab kontrollida lehel oleva lauamudeliga, vajadusel on lehe allosas debug option värvide kontrollimiseks, kus on näha, milliseid piksleid tuvastatakse.

### manuaalne input

vali lehe allosast "manuaalne lauamanipulatsioon" ja pane nupud paika. vajuta "SOLVE MANUAL BOARD", et leht arvutaks parima tulemuse ja kirjutaks selle csv-sse. 



