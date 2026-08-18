/* ============================================================
   HALL PASS — game library
   ------------------------------------------------------------
   TO ADD A GAME: copy one line, paste it, change the values.
   That's it. The homepage grid and the game pages both read
   from this file, so you never touch the HTML.

   id     = the code from the GameMonetize URL
            https://html5.gamemonetize.co/THIS_PART_HERE/
   name   = what shows on your site
   cat    = Action / Racing / Shooting / Sports / Puzzle /
            Casual / 2 Player / Multiplayer / Adventure
   ratio  = "wide" for normal games, "tall" for phone-shaped ones
   ============================================================ */

const GAMES = [
  { id: "52h9w7nwvg18qshzgzreq6h95cm71mc6", name: "One Shot Duel: Snipe Hide",       cat: "Shooting",    ratio: "wide" },
  { id: "q7055yc1h5obvp1pc9yqvc82det56ama", name: "Firefighter Plane",               cat: "Adventure",   ratio: "wide" },
  { id: "75qwpngek98802qfcz71n538jou9f71u", name: "Mini Boxing: Final Round",        cat: "Sports",      ratio: "tall" },
  { id: "7hrw0adv5wxux5822pnrppv3ks6owedf", name: "My Mini Mart 3D",                 cat: "Casual",      ratio: "wide" },
  { id: "lbzpa3rcu0ax9o64izpmb0mfgkq3k4vi", name: "Duck ShootingZ",                  cat: "Shooting",    ratio: "wide" },
  { id: "fyq9m40ndt6ep6s2vea5osr4xuuonu8p", name: "Aimball",                         cat: "Action",      ratio: "wide" },
  { id: "lzyq41x2j1jkcuad1h07zo6uq8ymx7tj", name: "Mr Bullet 3D Online",             cat: "Shooting",    ratio: "wide" },
  { id: "foof3euvtu1r928pcec4j0vtslnqqqy6", name: "Infantry Attack: Battle 3D",      cat: "Shooting",    ratio: "wide" },
  { id: "tmhj9i3trg8ot0u7h9qahh6flzn9zkjp", name: "Obby Cart Rush",                  cat: "Racing",      ratio: "wide" },
  { id: "f18vmxidmr661qlw0sez84ioo303oktj", name: "Zombie Survival Squad",           cat: "Action",      ratio: "wide" },
  { id: "cym6sfm8kebf73562van2bwa2tdz4prh", name: "Fireboy and Watergirl 6",         cat: "2 Player",    ratio: "wide" },
  { id: "6yovkiqs7z78ayor7opo2dr2c931qmsu", name: "Mine Blade: Online KitPvP",       cat: "Multiplayer", ratio: "wide" },
  { id: "c9ymaapep3zsqe34exm9z3wa3vrhd1ey", name: "Fiva 26: Soccer",                 cat: "Sports",      ratio: "wide" },
  { id: "9qpvw299afzmy7aok2xph76if4npkrg1", name: "Faster Car Race",                 cat: "Racing",      ratio: "wide" },
  { id: "jheblnqcjryfd1dsq5zfx7jhe3xopy2j", name: "Vehicle Rush Master",             cat: "Racing",      ratio: "wide" },
  { id: "tpyow50cvodm1m69t1ftvmtn7kxuq4hs", name: "Cargo Truck Hauler",              cat: "Racing",      ratio: "wide" },
  { id: "e8hbjltwg1xyxfrjaeo445egz3sxcra0", name: "Repel the Monster",               cat: "Action",      ratio: "wide" },
  { id: "r2p1xn2x3x0ozyyghzrdbvfdmp6poclb", name: "SpinHue",                         cat: "Puzzle",      ratio: "tall" },
  { id: "vtydh9x25bb30pqyg1lw2t315mj8jnnx", name: "Stickman Restaurant Rush",        cat: "Casual",      ratio: "wide" },
  { id: "jpdfq7l8s9yve9rmkvl8kyvvhrbauoz3", name: "Sila: Snow Run",                  cat: "Casual",      ratio: "tall" },
  { id: "tw5q4hpa0iplg8vdpd1ztxohsofmdc63", name: "Car Parking Driving",             cat: "Racing",      ratio: "wide" },
  { id: "lc3z0glrxydeamakuq96ypstn0ob81eq", name: "Plumber Bros Movie Run",          cat: "Adventure",   ratio: "wide" },
  { id: "qrhvp96ov1dj1w1u4l2ulb5i4gh9q19g", name: "Home Makeover Match",             cat: "Puzzle",      ratio: "wide" },
  { id: "u236durqjtk50353fytvc2t0aqwcibsa", name: "Mermaid Coloring Book",           cat: "Casual",      ratio: "wide" },
  { id: "9xids195rngeuvr82d6bbejbjtc3qwvf", name: "Taxi Simulator 3D",               cat: "Racing",      ratio: "wide" },
  { id: "bwolxkd6xio7zn2dd3472o6x5vhuemvp", name: "Zombie Parade Defense 2",         cat: "Action",      ratio: "wide" },
  { id: "l5r5qfdpg84232wpax159bif9hiomsqw", name: "Squad Game Escapers",             cat: "Action",      ratio: "wide" },
  { id: "jelf51z39ajaw98tamxjh6qihudou7rk", name: "Fly Airplane 3D",                 cat: "Adventure",   ratio: "wide" },
  { id: "k682jt9wtec2l3zo47lgm0p1lcrkvr0z", name: "Black Hole Fill 3D",              cat: "Casual",      ratio: "wide" },
  { id: "y771xcn0bnakil1525c08uyvt7mfqv9l", name: "Rocketcar Cup",                   cat: "2 Player",    ratio: "wide" },
  { id: "vfvzwo7t6oi9wx3njr5d0u9q429my3fc", name: "DungeonsQuest",                   cat: "Action",      ratio: "wide" },
  { id: "028jiue9mmiuwc0bk73kq2dvnjjryfmd", name: "Obby Rainbow Parkour Two Player", cat: "Adventure",   ratio: "wide" },
  { id: "61f0sj2xwzlkkq2dplyvhpvz9uqdvy03", name: "BugBlaster",                      cat: "Casual",      ratio: "wide" },
  { id: "f0bwtedu8xg3fu2qi5rg9ofz63lk0hz8", name: "Grab.io",                         cat: "Multiplayer", ratio: "wide" },
  { id: "qhhb4iv1pdxucs96dfx73jf5w3f0nwrx", name: "Red Flow",                        cat: "Puzzle",      ratio: "tall" },
  { id: "bqrzyb1gejidbz65soxtw6pknv0z9t2f", name: "Pastry Evolution Game",           cat: "Racing",      ratio: "wide" },
  { id: "f35frmezumwujtdqf1vx6m22j3ifc3lv", name: "Hit Tank Battle",                 cat: "Shooting",    ratio: "wide" },
  { id: "ebef4rqz7pw2i6fbcdzle933t6a3xcm4", name: "Footballer of the Year",          cat: "Sports",      ratio: "tall" },
  { id: "r3qvkqbkdf9k0udn72wk7lgdu88yotme", name: "Master Punch",                    cat: "Action",      ratio: "wide" },
  { id: "r3vo5ws40byv0aezlsk8933zas8jgydx", name: "Inkway",                          cat: "Adventure",   ratio: "wide" },
  { id: "wtno9cz4m6cu92lr4f9dopo2slq6l3hk", name: "REFLEX PONG",                     cat: "Casual",      ratio: "wide" },
  { id: "odelq0qdc12p5bftdafkq6l2u3gkj2un", name: "Brush Cat Challenge",             cat: "Multiplayer", ratio: "wide" },
  { id: "o66t96vx9e9ewdmd3z6uxjs0pvfjpbyi", name: "Pipe Out Game",                   cat: "Puzzle",      ratio: "wide" },
  { id: "zlaendl789evsri1tisxazdrh41sf5fn", name: "Bus Driving Master 3D",           cat: "Racing",      ratio: "wide" },
  { id: "m08ek7zjog1w0qybswdbw6407100mme5", name: "ObbloxGun.io 3D FPS Shooter",     cat: "Shooting",    ratio: "wide" },
  { id: "y08eouzwdisflpzrb4r0i23fmdus8l0d", name: "Soccer Battle Online",            cat: "Sports",      ratio: "wide" },
  { id: "8ehobomojvuqbl2klpyqutl44ljfes4o", name: "Evolution Era",                   cat: "Action",      ratio: "wide" },
  { id: "8xm1lwmqdvr54tcjyi0t91qn87yzipz7", name: "Jungle Climber",                  cat: "Adventure",   ratio: "wide" },
  { id: "6qsidjlo1o3k80dawqiqyy70n7oq5u4w", name: "Crakko",                          cat: "Casual",      ratio: "wide" },
  { id: "mucxqqhaoah9q6mt60k70clzjzesy1cc", name: "imposter Duck : Online",          cat: "Multiplayer", ratio: "wide" },
  { id: "qowg2waab92pn74ur1v8iayk5se8pp5q", name: "Mahjong Tiles Match",             cat: "Puzzle",      ratio: "wide" },
  { id: "kxtqgfy0t8zbz9hh44068ythow4chjxy", name: "Cycle Racing Game",               cat: "Racing",      ratio: "wide" },
  { id: "u42xjlqg0tny1ez5lsn0d5v0n1ehzdxh", name: "Iron Legion 0.28",                cat: "Shooting",    ratio: "wide" },
  { id: "3btpzz8d1g9m1ytjqftjc4zapsvol0kz", name: "Toy Soccer Cup",                  cat: "Sports",      ratio: "wide" },
  { id: "wlfrsj5bove2q1xpw5uouijfnay4gmd6", name: "I Am Cake No Cats",               cat: "Action",      ratio: "wide" },
  { id: "jjn7j2vq5j59e0zum1y0n2zsi6qhszo8", name: "Car Parking Game: Parking Jam",   cat: "Adventure",   ratio: "wide" },
  { id: "v40baihxfe2jufbvbgupsrliwgvnpnuo", name: "LunarLeap",                       cat: "Casual",      ratio: "wide" },
  { id: "fwiozook1vr9lw7duxy81zup5676u7bj", name: "Speen",                           cat: "Multiplayer", ratio: "wide" },
  { id: "4ajil6uv2opb56xkcffrmvyh7mqih6ov", name: "Traffic Run Game",                cat: "Puzzle",      ratio: "wide" },
  { id: "m00hcof3fuskic5zjn56oyceee6it6ub", name: "City Car Driving Game",           cat: "Racing",      ratio: "wide" },
  { id: "xluntt2g2ij4zf2lrthjozqe4vhx8qi3", name: "STORMHAWK",                       cat: "Shooting",    ratio: "wide" },
  { id: "8vhdopjanzhjkj455tafjjn4m11vvdj5", name: "GoalShot",                        cat: "Sports",      ratio: "wide" },
  { id: "6aqzdi6qwqqegzoiaxyb538fw60eym6n", name: "Meccha Chameleon Online",         cat: "Action",      ratio: "wide" },
  { id: "hdec9dyfvvamsl61ku2y6way8ay6xmnz", name: "3D Police Car Parking",           cat: "Adventure",   ratio: "wide" },
  { id: "t8s82rq1o8991w55wzdccw4gv683i5sp", name: "Ninja on the Run",                cat: "Casual",      ratio: "tall" },
  { id: "gpnthl10ris6862m1lrywpqk8gc4zk4v", name: "Music Night Battle: Rhythm Game", cat: "Multiplayer", ratio: "wide" },
  { id: "z97yt0wa0977yqbl82xlw79f51hgch6k", name: "Cube Match Logic",                cat: "Puzzle",      ratio: "wide" },
  { id: "gzflbajv1u83ewinan6z4zi45b8pezix", name: "Car Driving School Game",         cat: "Racing",      ratio: "wide" },
  { id: "66bos2g1jhk2r1ja7d9m1w8bx5in42wm", name: "Undead Walking 3D",               cat: "Shooting",    ratio: "wide" },
  { id: "lzjgq0b17ad2v91aaosalfcsntdvibxg", name: "Pro Golfer Game",                 cat: "Sports",      ratio: "wide" },
  { id: "d9dy1x6ir1kghv1mdi2m274h6c4zr9vh", name: "Oil Tanker Simulator",            cat: "Action",      ratio: "wide" },
  { id: "hzf19f3av9py4xbzagooa3aceow0w16k", name: "Crowd Rush Game",                 cat: "Adventure",   ratio: "wide" },
  { id: "9w0qmuj86ajgcllpr8vlwsfb9l74tgr4", name: "Charlotte crossing Game",         cat: "Casual",      ratio: "tall" },
  { id: "cybh6ym22ww2ehlpu23d6azrudls31ar", name: "Stickman Trivia Fall IO",         cat: "Multiplayer", ratio: "wide" },
  { id: "3wwixwgy2gmmlc7i2mp4oa60qgcjfw6g", name: "MealMerge",                       cat: "Puzzle",      ratio: "wide" },
  { id: "f4zwdj4r3e6lzaedanxm2porz4fjogt1", name: "Head Punch Game",                 cat: "Racing",      ratio: "wide" },
  { id: "8wn4vu90rxh6ln82i8s066610snxmoiu", name: "Dragon Power",                    cat: "Shooting",    ratio: "wide" },
  { id: "9uxpbx5t0rvyg600zmldkd7wlkrxg73i", name: "Funny Volleyball",                cat: "Sports",      ratio: "tall" },
  { id: "10h5rl1woq4onsog17rz5sq4zo6esrqu", name: "Blast Master",                    cat: "Action",      ratio: "wide" },
  { id: "0o809stnweumarznsndf1tfs7imrt6hv", name: "US Army Truck Driving",           cat: "Adventure",   ratio: "wide" },
  { id: "xvltur4crww6rmp5pv8z2n6nn9vt5baz", name: "Dangerous Turn",                  cat: "Casual",      ratio: "tall" },
  { id: "f6ung9e7lfninu1957spejeihzprdusb", name: "Castle Wars: Legacy",             cat: "Multiplayer", ratio: "wide" },
  { id: "tqn7dlmwx2web04cktjuiw5461epbpl7", name: "Paletto",                         cat: "Puzzle",      ratio: "wide" },
  { id: "8b02mtykblur16cydn1hkg316mp0e0ir", name: "Turbo Team Racing",               cat: "Racing",      ratio: "tall" },
  { id: "prhu172i8mne9pzmzscopypk1eyrqvve", name: "Zombi Defense",                   cat: "Shooting",    ratio: "wide" },
  { id: "61chjn7t8hxotsfbkngwexcggusvsiy3", name: "Dart Duell: Timing Champion",     cat: "Sports",      ratio: "wide" },
  { id: "u9582lot2ztja6dbuu6j4vv15izf1rdv", name: "Blocky Adventures",               cat: "Action",      ratio: "wide" },
  { id: "1wbzg7j5gb9tylzaec80kj73bqoliwyk", name: "Run Witch Run",                   cat: "Adventure",   ratio: "wide" },
  { id: "fusx01gf7ofn4wl53s98bwy5wqab46bu", name: "Lovely Cat: Dessert Bakery",      cat: "Casual",      ratio: "wide" },
  { id: "f1e896emfy104h8j8higjjdkcqeqvtau", name: "Guardz IO",                       cat: "Multiplayer", ratio: "wide" },
  { id: "qc5zqtip5a27bx33aez8sudb8uixp3ew", name: "Skyslime Adventures",             cat: "Puzzle",      ratio: "wide" },
  { id: "dmbvkzqhkgd6mxchjrkvg95q2ra1xw7m", name: "Advance Car Game Parking",        cat: "Racing",      ratio: "wide" },
  { id: "awoa5hf68467okwkcqntdqo7kzuvx2bq", name: "Sniper Corps",                    cat: "Shooting",    ratio: "wide" },
  { id: "m80zl2zju526tsbt8e43e8ugzq8334wo", name: "PlayPair",                        cat: "Sports",      ratio: "wide" },
  { id: "3didn90hfvkoy0ib84zl67x4jfbd0bla", name: "Paper Stick Figures",             cat: "Action",      ratio: "wide" },
  { id: "f91xd89vj9iil1w8l84fivewmvpg83w5", name: "Ambulance Rescue Game",           cat: "Adventure",   ratio: "wide" },
  { id: "yrswy4d6185wahdcusju86ztjhn6zvem", name: "Slice It",                        cat: "Casual",      ratio: "wide" },
  { id: "uxv01zwcngh7d3xm1aqdg9t91qfuh59n", name: "SNAKE WARZ",                      cat: "Multiplayer", ratio: "wide" },
  { id: "ihrv24pwbcnctn9bb6m2m3fu5eq4ou47", name: "Cute Farm Match Puzzle",          cat: "Puzzle",      ratio: "tall" },
  { id: "veee08w4fcs1kodxfcmnycjgpmch0go6", name: "Formula Car Stunt Game",          cat: "Racing",      ratio: "wide" }
];

/* --- helpers used by both pages --- */
const gameUrl  = g => `https://html5.gamemonetize.co/${g.id}/`;
const gameThumb = g => `https://img.gamemonetize.com/${g.id}/512x384.jpg`;
const gameSlug = g => g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const findGame = slug => GAMES.find(g => gameSlug(g) === slug);
