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
  { id: "52h9w7nwvg18qshzgzreq6h95cm71mc6", name: "One Shot Duel: Snipe Hide", cat: "Shooting",    ratio: "wide" },
  { id: "q7055yc1h5obvp1pc9yqvc82det56ama", name: "Firefighter Plane",         cat: "Adventure",   ratio: "wide" },
  { id: "75qwpngek98802qfcz71n538jou9f71u", name: "Mini Boxing: Final Round",  cat: "Sports",      ratio: "tall" },
  { id: "7hrw0adv5wxux5822pnrppv3ks6owedf", name: "My Mini Mart 3D",           cat: "Casual",      ratio: "wide" },
  { id: "lbzpa3rcu0ax9o64izpmb0mfgkq3k4vi", name: "Duck ShootingZ",            cat: "Shooting",    ratio: "wide" },
  { id: "fyq9m40ndt6ep6s2vea5osr4xuuonu8p", name: "Aimball",                   cat: "Action",      ratio: "wide" },
  { id: "lzyq41x2j1jkcuad1h07zo6uq8ymx7tj", name: "Mr Bullet 3D Online",       cat: "Shooting",    ratio: "wide" },
  { id: "foof3euvtu1r928pcec4j0vtslnqqqy6", name: "Infantry Attack: Battle 3D",cat: "Shooting",    ratio: "wide" },
  { id: "tmhj9i3trg8ot0u7h9qahh6flzn9zkjp", name: "Obby Cart Rush",            cat: "Racing",      ratio: "wide" },
  { id: "f18vmxidmr661qlw0sez84ioo303oktj", name: "Zombie Survival Squad",     cat: "Action",      ratio: "wide" },
  { id: "cym6sfm8kebf73562van2bwa2tdz4prh", name: "Fireboy and Watergirl 6",   cat: "2 Player",    ratio: "wide" },
  { id: "6yovkiqs7z78ayor7opo2dr2c931qmsu", name: "Mine Blade: Online KitPvP", cat: "Multiplayer", ratio: "wide" },
  { id: "c9ymaapep3zsqe34exm9z3wa3vrhd1ey", name: "Fiva 26: Soccer",           cat: "Sports",      ratio: "wide" },
  { id: "9qpvw299afzmy7aok2xph76if4npkrg1", name: "Faster Car Race",           cat: "Racing",      ratio: "wide" },
  { id: "jheblnqcjryfd1dsq5zfx7jhe3xopy2j", name: "Vehicle Rush Master",       cat: "Racing",      ratio: "wide" },
  { id: "tpyow50cvodm1m69t1ftvmtn7kxuq4hs", name: "Cargo Truck Hauler",        cat: "Racing",      ratio: "wide" },
  { id: "e8hbjltwg1xyxfrjaeo445egz3sxcra0", name: "Repel the Monster",         cat: "Action",      ratio: "wide" },
  { id: "r2p1xn2x3x0ozyyghzrdbvfdmp6poclb", name: "SpinHue",                   cat: "Puzzle",      ratio: "tall" },
  { id: "vtydh9x25bb30pqyg1lw2t315mj8jnnx", name: "Stickman Restaurant Rush",  cat: "Casual",      ratio: "wide" },
  { id: "jpdfq7l8s9yve9rmkvl8kyvvhrbauoz3", name: "Sila: Snow Run",            cat: "Casual",      ratio: "tall" },
  { id: "tw5q4hpa0iplg8vdpd1ztxohsofmdc63", name: "Car Parking Driving",       cat: "Racing",      ratio: "wide" },
  { id: "lc3z0glrxydeamakuq96ypstn0ob81eq", name: "Plumber Bros Movie Run",    cat: "Adventure",   ratio: "wide" },
  { id: "qrhvp96ov1dj1w1u4l2ulb5i4gh9q19g", name: "Home Makeover Match",       cat: "Puzzle",      ratio: "wide" },
  { id: "u236durqjtk50353fytvc2t0aqwcibsa", name: "Mermaid Coloring Book",     cat: "Casual",      ratio: "wide" },
  { id: "9xids195rngeuvr82d6bbejbjtc3qwvf", name: "Taxi Simulator 3D",         cat: "Racing",      ratio: "wide" },
  { id: "bwolxkd6xio7zn2dd3472o6x5vhuemvp", name: "Zombie Parade Defense 2",   cat: "Action",      ratio: "wide" },
  { id: "l5r5qfdpg84232wpax159bif9hiomsqw", name: "Squad Game Escapers",       cat: "Action",      ratio: "wide" },
  { id: "jelf51z39ajaw98tamxjh6qihudou7rk", name: "Fly Airplane 3D",           cat: "Adventure",   ratio: "wide" },
  { id: "k682jt9wtec2l3zo47lgm0p1lcrkvr0z", name: "Black Hole Fill 3D",        cat: "Casual",      ratio: "wide" }
];

/* --- helpers used by both pages --- */
const gameUrl  = g => `https://html5.gamemonetize.co/${g.id}/`;
const gameThumb = g => `https://img.gamemonetize.com/${g.id}/512x384.jpg`;
const gameSlug = g => g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const findGame = slug => GAMES.find(g => gameSlug(g) === slug);
