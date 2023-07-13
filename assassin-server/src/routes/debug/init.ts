import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, insertPlayer, setStatus } from '../../tables/player'
import { createRoomsTable, insertRoom } from '../../tables/room'
import { createWordTable, insertWords } from '../../tables/word'
import { createWordListTable, insertWordList } from '../../tables/wordlist'

interface InitializeBody {
	room?: string
	players?: string[]
	wordLists?: string[]
}

export const InitializeDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const { room, players, wordLists } = await c.req.json<InitializeBody>()

		// Create D1 tables if needed
		await createRoomsTable(db)
		await createPlayerTable(db)
		await createWordListTable(db)
		await createWordTable(db)

		// Insert demo room
		if (room !== undefined) {
			try {
				await insertRoom(db, room)
			} catch {
				//nop
			}
		}
		if (players !== undefined && players.length > 0) {
			for (let i = 0; i < players.length; i++) {
				await insertPlayer(db, room!, players[i], i === 0)

				if (i === players.length - 1) {
					await setStatus(db, room!, players[i], 'eliminated')
				}
			}
		}

		if (wordLists && wordLists.length > 0) {
			//#region test-list
			if (wordLists?.includes('test-list')) {
				console.log('Adding test-list wordlist')
				await insertWordList(db, 'test-list', 'This is a list of test words to use.')
				const words = ['test', 'words', 'go', 'here', 'more', 'also', 'foo', 'bar', 'baz', 'foobar', 'foobaz', 'barbaz']
				await insertWords(db, 'test-list', words)
			}
			//#endregion

			//#region card-poison
			if (wordLists?.includes('card-poison')) {
				console.log('Adding card-poison wordlist')

				await insertWordList(db, 'card-poison', '"Poison" wordlist from the Card Assassins game.', 'flask-round-poison')
				const words = [
					'finger',
					'prince',
					'planet',
					'depth',
					'gluten',
					'accent',
					'elder',
					'science',
					'mother',
					'tango',
					'board',
					'fishing',
					'drums',
					'bass',
					'buffalo',
					'space',
					'avocado',
					'parrot',
					'airplane',
					'hashtag',
					'fudge',
					'cloud',
					'hammer',
					'palm',
					'beef',
					'wig',
					'cape',
					'pool',
					'jet',
					'zombie',
					'robin',
					'bounty',
					'drag',
					'pie',
					'six-pack',
					'absent',
					'shoot',
					'hawaiian',
					'vampire',
					'flag',
					'classic',
					'mime',
					'lndon',
					'mustache',
					'panda',
					'ham',
					'bubble',
					'holy',
					'quarter',
					'shave',
					'Elvis',
					'onion',
					'stab',
					'jedi',
					'hotdog',
					'eagle',
					'surgeon',
					'flower',
					'joke',
					'tinkle',
					'golf',
					'walnut',
					'comet',
					'fish',
					'bone',
					'brick',
					'bacon',
					'rug',
					'extra',
					'gum',
					'robot',
					'Napoleon',
					'spoon',
					'cave',
					'hipster',
					'snake',
					'gold',
					'volcano',
					'ketchup',
					'donut',
					'tail',
					'paper',
					'inflate',
					'pinecone',
					'freckle',
					'salami',
					'mask',
					'steak',
					'chin',
					'clam',
					'moon',
					'cucumber',
					'brownie',
					'roof',
					'pony',
					'bald',
					'pimple',
					'moose',
					'caveman',
					'bark',
					'arrow',
					'frame',
					'knee',
					'sneak',
					'frown',
					'horse',
					'comb',
					'melon',
					'soy',
					'irish',
					'grudge',
					'queen',
					'crap',
					'avenue',
					'cake',
					'ufo',
					'diamond',
					'mustard',
					'net',
					'campfire',
					'armpit',
					'arnold',
					'karate',
				]
				await insertWords(db, 'card-poison', words)
			}
			//#endregion

			//#region card-dagger
			if (wordLists?.includes('card-dagger')) {
				console.log('Adding card-dagger wordlist')

				await insertWordList(db, 'card-dagger', '"Dagger" wordlist from the Card Assassins game.', 'dagger')
				const words = [
					'penny',
					'public',
					'exclamation',
					'hunt',
					'flame',
					'worthless',
					'bear',
					'bum',
					'vegan',
					'film',
					'rhino',
					'spaghetti',
					'compost',
					'elf',
					'condiments',
					'evil',
					'mango',
					'sink',
					'elbow',
					'boot',
					'tiki',
					'tag',
					'squid',
					'chuck',
					'tip',
					'sweat',
					'yolo',
					'computer',
					'lobster',
					'Saturn',
					'church',
					'ninja',
					'lasagna',
					'volume',
					'politics',
					'wave',
					'shark',
					'float',
					'hamburger',
					'sushi',
					'smelly',
					'supreme',
					'dice',
					'stump',
					'crumb',
					'sausage',
					'rapper',
					'copper',
					'burn',
					'bounce',
					'clown',
					'germ',
					'wifi',
					'kale',
					'egg',
					'stool',
					'notebook',
					'goal',
					'tuna',
					'worm',
					'beard',
					'spit',
					'Homer',
					'fork',
					'shadow',
					'edge',
					'breakfast',
					'crayon',
					'Romeo',
					'castle',
					'Brazil',
					'wheelchair',
					'jail',
					'luck',
					'hangry',
					'duck',
					'wheat',
					'danger',
					'star',
					'toast',
					'meme',
					'Christmas',
					'BBQ',
					'machete',
					'skin',
					'cheddar',
					'cube',
					'shake',
					'yoga',
					'mouse',
					'curry',
					'hawk',
					'underwear',
					'ring',
					'axe',
					'flock',
					'punch',
					'mullet',
					'clone',
					'hiccup',
					'jazz',
					'bobcat',
					'king',
					'party',
					'slam',
					'yawn',
					'hen',
					'satellite',
					'candy',
					'religion',
					'bend',
					'ping-pong',
					'brain',
					'asleep',
					'dive',
					'limo',
					'swag',
					'chill',
					'tide',
					'waltz',
					'alien',
					'puck',
					'karaoke',
				]
				await insertWords(db, 'card-dagger', words)
			}
			//#endregion

			//#region team-galactic
			if (wordLists?.includes('team-galactic')) {
				console.log('Adding team-galactic wordlist')

				await insertWordList(db, 'team-galactic', 'Words for TPCi Team Galactic.', 'stars')
				const words: string[] = []
				await insertWords(db, 'team-galactic', words)
			}
			//#endregion

			//#region team-green
			if (wordLists?.includes('team-green')) {
				console.log('Adding team-green wordlist')

				await insertWordList(db, 'team-green', 'Words for Azure Monitor Green Team.', 'chart-line-up')
				const words: string[] = []
				await insertWords(db, 'team-green', words)
			}
			//#endregion

			//#region technology
			if (wordLists?.includes('technology')) {
				console.log('Adding technology wordlist')

				await insertWordList(db, 'technology', 'General technology terms and concepts.', 'computer-classic')
				const words: string[] = []
				await insertWords(db, 'technology', words)
			}
			//#endregion

			//#region countries
			if (wordLists?.includes('countries')) {
				console.log('Adding countries wordlist')

				await insertWordList(db, 'countries', 'Names of countries around the world.', 'earth-americas')
				const words: string[] = [
					'Afghanistan',
					'Albania',
					'Algeria',
					'American Samoa',
					'Andorra',
					'Angola',
					'Antigua and Barbuda',
					'Argentina',
					'Armenia',
					'Aruba',
					'Australia',
					'Austria',
					'Azerbaijan',
					'Bahamas',
					'Bahrain',
					'Bangladesh',
					'Barbados',
					'Belarus',
					'Belgium',
					'Belize',
					'Benin',
					'Bermuda',
					'Bhutan',
					'Bolivia',
					'Bosnia and Herzegovina',
					'Botswana',
					'Brazil',
					'British Virgin Islands',
					'Brunei Darussalam',
					'Bulgaria',
					'Burkina Faso',
					'Burundi',
					'Cabo Verde',
					'Cambodia',
					'Cameroon',
					'Canada',
					'Cayman Islands',
					'Central African Republic',
					'Chad',
					'Channel Islands',
					'Chile',
					'China',
					'Colombia',
					'Comoros',
					'Congo',
					'Costa Rica',
					"Cote d'Ivoire",
					'Croatia',
					'Cuba',
					'Curacao',
					'Cyprus',
					'Czechia',
					'Denmark',
					'Djibouti',
					'Dominica',
					'Dominican Republic',
					'Ecuador',
					'Egypt',
					'El Salvador',
					'Equatorial Guinea',
					'Eritrea',
					'Estonia',
					'Eswatini',
					'Ethiopia',
					'Faroe Islands',
					'Fiji',
					'Finland',
					'France',
					'French Polynesia',
					'Gabon',
					'Gambia',
					'Georgia',
					'Germany',
					'Ghana',
					'Gibraltar',
					'Greece',
					'Greenland',
					'Grenada',
					'Guam',
					'Guatemala',
					'Guinea',
					'Guyana',
					'Haiti',
					'Honduras',
					'Hong Kong',
					'Hungary',
					'Iceland',
					'India',
					'Indonesia',
					'Iran',
					'Iraq',
					'Ireland',
					'Isle of Man',
					'Israel',
					'Italy',
					'Jamaica',
					'Japan',
					'Jordan',
					'Kazakhstan',
					'Kenya',
					'Kiribati',
					'North Korea',
					'South Korea',
					'Kosovo',
					'Kuwait',
					'Kyrgyz Republic',
					'Laos',
					'Latvia',
					'Lebanon',
					'Lesotho',
					'Liberia',
					'Libya',
					'Liechtenstein',
					'Lithuania',
					'Luxembourg',
					'Macao',
					'Madagascar',
					'Malawi',
					'Malaysia',
					'Maldives',
					'Mali',
					'Malta',
					'Marshall Islands',
					'Mauritania',
					'Mauritius',
					'Mexico',
					'Micronesia',
					'Moldova',
					'Monaco',
					'Mongolia',
					'Montenegro',
					'Morocco',
					'Mozambique',
					'Myanmar',
					'Namibia',
					'Nauru',
					'Nepal',
					'Netherlands',
					'New Caledonia',
					'New Zealand',
					'Nicaragua',
					'Niger',
					'Nigeria',
					'North Macedonia',
					'Northern Mariana Islands',
					'Norway',
					'Oman',
					'Pakistan',
					'Palau',
					'Panama',
					'Papua New Guinea',
					'Paraguay',
					'Peru',
					'Philippines',
					'Poland',
					'Portugal',
					'Puerto Rico',
					'Qatar',
					'Romania',
					'Russia',
					'Rwanda',
					'Samoa',
					'San Marino',
					'Sao Tome and Principe',
					'Saudi Arabia',
					'Senegal',
					'Serbia',
					'Seychelles',
					'Sierra Leone',
					'Singapore',
					'Slovak Republic',
					'Slovenia',
					'Solomon Islands',
					'Somalia',
					'South Africa',
					'South Sudan',
					'Spain',
					'Sri Lanka',
					'St. Kitts and Nevis',
					'St. Lucia',
					'St. Martin',
					'St. Vincent and the Grenadines',
					'Sudan',
					'Suriname',
					'Sweden',
					'Switzerland',
					'Syria',
					'Tajikistan',
					'Tanzania',
					'Thailand',
					'Timor-Leste',
					'Togo',
					'Tonga',
					'Trinidad and Tobago',
					'Tunisia',
					'Turkiye',
					'Turkmenistan',
					'Turks and Caicos Islands',
					'Tuvalu',
					'Uganda',
					'Ukraine',
					'United Arab Emirates',
					'United Kingdom',
					'United States',
					'Uruguay',
					'Uzbekistan',
					'Vanuatu',
					'Venezuela',
					'Vietnam',
					'Virgin Islands',
					'West Bank and Gaza',
					'Yemen',
					'Zambia',
					'Zimbabwe',
				]
				await insertWords(db, 'countries', words)
			}
			//#endregion

			//#region pokemon
			if (wordLists?.includes('pokemon')) {
				console.log('Adding pokemon wordlist')

				await insertWordList(db, 'pokemon', 'Names of Pokémon from across generations.', 'circle-half-stroke')
				const words: string[] = [
					'Bulbasaur',
					'Ivysaur',
					'Venusaur',
					'Charmander',
					'Charmeleon',
					'Charizard',
					'Squirtle',
					'Wartortle',
					'Blastoise',
					'Caterpie',
					'Metapod',
					'Butterfree',
					'Weedle',
					'Kakuna',
					'Beedrill',
					'Pidgey',
					'Pidgeotto',
					'Pidgeot',
					'Rattata',
					'Raticate',
					'Spearow',
					'Fearow',
					'Ekans',
					'Arbok',
					'Pikachu',
					'Raichu',
					'Sandshrew',
					'Sandslash',
					'Nidoran♀',
					'Nidorina',
					'Nidoqueen',
					'Nidoran♂',
					'Nidorino',
					'Nidoking',
					'Clefairy',
					'Clefable',
					'Vulpix',
					'Ninetales',
					'Jigglypuff',
					'Wigglytuff',
					'Zubat',
					'Golbat',
					'Oddish',
					'Gloom',
					'Vileplume',
					'Paras',
					'Parasect',
					'Venonat',
					'Venomoth',
					'Diglett',
					'Dugtrio',
					'Meowth',
					'Persian',
					'Psyduck',
					'Golduck',
					'Mankey',
					'Primeape',
					'Growlithe',
					'Arcanine',
					'Poliwag',
					'Poliwhirl',
					'Poliwrath',
					'Abra',
					'Kadabra',
					'Alakazam',
					'Machop',
					'Machoke',
					'Machamp',
					'Bellsprout',
					'Weepinbell',
					'Victreebel',
					'Tentacool',
					'Tentacruel',
					'Geodude',
					'Graveler',
					'Golem',
					'Ponyta',
					'Rapidash',
					'Slowpoke',
					'Slowbro',
					'Magnemite',
					'Magneton',
					"Farfetch'd",
					'Doduo',
					'Dodrio',
					'Seel',
					'Dewgong',
					'Grimer',
					'Muk',
					'Shellder',
					'Cloyster',
					'Gastly',
					'Haunter',
					'Gengar',
					'Onix',
					'Drowzee',
					'Hypno',
					'Krabby',
					'Kingler',
					'Voltorb',
					'Electrode',
					'Exeggcute',
					'Exeggutor',
					'Cubone',
					'Marowak',
					'Hitmonlee',
					'Hitmonchan',
					'Lickitung',
					'Koffing',
					'Weezing',
					'Rhyhorn',
					'Rhydon',
					'Chansey',
					'Tangela',
					'Kangaskhan',
					'Horsea',
					'Seadra',
					'Goldeen',
					'Seaking',
					'Staryu',
					'Starmie',
					'Mr. Mime',
					'Scyther',
					'Jynx',
					'Electabuzz',
					'Magmar',
					'Pinsir',
					'Tauros',
					'Magikarp',
					'Gyarados',
					'Lapras',
					'Ditto',
					'Eevee',
					'Vaporeon',
					'Jolteon',
					'Flareon',
					'Porygon',
					'Omanyte',
					'Omastar',
					'Kabuto',
					'Kabutops',
					'Aerodactyl',
					'Snorlax',
					'Articuno',
					'Zapdos',
					'Moltres',
					'Dratini',
					'Dragonair',
					'Dragonite',
					'Mewtwo',
					'Mew',
					'Chikorita',
					'Bayleef',
					'Meganium',
					'Cyndaquil',
					'Quilava',
					'Typhlosion',
					'Totodile',
					'Croconaw',
					'Feraligatr',
					'Sentret',
					'Furret',
					'Hoothoot',
					'Noctowl',
					'Ledyba',
					'Ledian',
					'Spinarak',
					'Ariados',
					'Crobat',
					'Chinchou',
					'Lanturn',
					'Pichu',
					'Cleffa',
					'Igglybuff',
					'Togepi',
					'Togetic',
					'Natu',
					'Xatu',
					'Mareep',
					'Flaaffy',
					'Ampharos',
					'Bellossom',
					'Marill',
					'Azumarill',
					'Sudowoodo',
					'Politoed',
					'Hoppip',
					'Skiploom',
					'Jumpluff',
					'Aipom',
					'Sunkern',
					'Sunflora',
					'Yanma',
					'Wooper',
					'Quagsire',
					'Espeon',
					'Umbreon',
					'Murkrow',
					'Slowking',
					'Misdreavus',
					'Unown',
					'Wobbuffet',
					'Girafarig',
					'Pineco',
					'Forretress',
					'Dunsparce',
					'Gligar',
					'Steelix',
					'Snubbull',
					'Granbull',
					'Qwilfish',
					'Scizor',
					'Shuckle',
					'Heracross',
					'Sneasel',
					'Teddiursa',
					'Ursaring',
					'Slugma',
					'Magcargo',
					'Swinub',
					'Piloswine',
					'Corsola',
					'Remoraid',
					'Octillery',
					'Delibird',
					'Mantine',
					'Skarmory',
					'Houndour',
					'Houndoom',
					'Kingdra',
					'Phanpy',
					'Donphan',
					'Porygon2',
					'Stantler',
					'Smeargle',
					'Tyrogue',
					'Hitmontop',
					'Smoochum',
					'Elekid',
					'Magby',
					'Miltank',
					'Blissey',
					'Raikou',
					'Entei',
					'Suicune',
					'Larvitar',
					'Pupitar',
					'Tyranitar',
					'Lugia',
					'Ho-Oh',
					'Celebi',
					'Treecko',
					'Grovyle',
					'Sceptile',
					'Torchic',
					'Combusken',
					'Blaziken',
					'Mudkip',
					'Marshtomp',
					'Swampert',
					'Poochyena',
					'Mightyena',
					'Zigzagoon',
					'Linoone',
					'Wurmple',
					'Silcoon',
					'Beautifly',
					'Cascoon',
					'Dustox',
					'Lotad',
					'Lombre',
					'Ludicolo',
					'Seedot',
					'Nuzleaf',
					'Shiftry',
					'Taillow',
					'Swellow',
					'Wingull',
					'Pelipper',
					'Ralts',
					'Kirlia',
					'Gardevoir',
					'Surskit',
					'Masquerain',
					'Shroomish',
					'Breloom',
					'Slakoth',
					'Vigoroth',
					'Slaking',
					'Nincada',
					'Ninjask',
					'Shedinja',
					'Whismur',
					'Loudred',
					'Exploud',
					'Makuhita',
					'Hariyama',
					'Azurill',
					'Nosepass',
					'Skitty',
					'Delcatty',
					'Sableye',
					'Mawile',
					'Aron',
					'Lairon',
					'Aggron',
					'Meditite',
					'Medicham',
					'Electrike',
					'Manectric',
					'Plusle',
					'Minun',
					'Volbeat',
					'Illumise',
					'Roselia',
					'Gulpin',
					'Swalot',
					'Carvanha',
					'Sharpedo',
					'Wailmer',
					'Wailord',
					'Numel',
					'Camerupt',
					'Torkoal',
					'Spoink',
					'Grumpig',
					'Spinda',
					'Trapinch',
					'Vibrava',
					'Flygon',
					'Cacnea',
					'Cacturne',
					'Swablu',
					'Altaria',
					'Zangoose',
					'Seviper',
					'Lunatone',
					'Solrock',
					'Barboach',
					'Whiscash',
					'Corphish',
					'Crawdaunt',
					'Baltoy',
					'Claydol',
					'Lileep',
					'Cradily',
					'Anorith',
					'Armaldo',
					'Feebas',
					'Milotic',
					'Castform',
					'Kecleon',
					'Shuppet',
					'Banette',
					'Duskull',
					'Dusclops',
					'Tropius',
					'Chimecho',
					'Absol',
					'Wynaut',
					'Snorunt',
					'Glalie',
					'Spheal',
					'Sealeo',
					'Walrein',
					'Clamperl',
					'Huntail',
					'Gorebyss',
					'Relicanth',
					'Luvdisc',
					'Bagon',
					'Shelgon',
					'Salamence',
					'Beldum',
					'Metang',
					'Metagross',
					'Regirock',
					'Regice',
					'Registeel',
					'Latias',
					'Latios',
					'Kyogre',
					'Groudon',
					'Rayquaza',
					'Jirachi',
					'Deoxys',
					'Turtwig',
					'Grotle',
					'Torterra',
					'Chimchar',
					'Monferno',
					'Infernape',
					'Piplup',
					'Prinplup',
					'Empoleon',
					'Starly',
					'Staravia',
					'Staraptor',
					'Bidoof',
					'Bibarel',
					'Kricketot',
					'Kricketune',
					'Shinx',
					'Luxio',
					'Luxray',
					'Budew',
					'Roserade',
					'Cranidos',
					'Rampardos',
					'Shieldon',
					'Bastiodon',
					'Burmy',
					'Wormadam',
					'Mothim',
					'Combee',
					'Vespiquen',
					'Pachirisu',
					'Buizel',
					'Floatzel',
					'Cherubi',
					'Cherrim',
					'Shellos',
					'Gastrodon',
					'Ambipom',
					'Drifloon',
					'Drifblim',
					'Buneary',
					'Lopunny',
					'Mismagius',
					'Honchkrow',
					'Glameow',
					'Purugly',
					'Chingling',
					'Stunky',
					'Skuntank',
					'Bronzor',
					'Bronzong',
					'Bonsly',
					'Mime Jr.',
					'Happiny',
					'Chatot',
					'Spiritomb',
					'Gible',
					'Gabite',
					'Garchomp',
					'Munchlax',
					'Riolu',
					'Lucario',
					'Hippopotas',
					'Hippowdon',
					'Skorupi',
					'Drapion',
					'Croagunk',
					'Toxicroak',
					'Carnivine',
					'Finneon',
					'Lumineon',
					'Mantyke',
					'Snover',
					'Abomasnow',
					'Weavile',
					'Magnezone',
					'Lickilicky',
					'Rhyperior',
					'Tangrowth',
					'Electivire',
					'Magmortar',
					'Togekiss',
					'Yanmega',
					'Leafeon',
					'Glaceon',
					'Gliscor',
					'Mamoswine',
					'Porygon-Z',
					'Gallade',
					'Probopass',
					'Dusknoir',
					'Froslass',
					'Rotom',
					'Uxie',
					'Mesprit',
					'Azelf',
					'Dialga',
					'Palkia',
					'Heatran',
					'Regigigas',
					'Giratina',
					'Cresselia',
					'Phione',
					'Manaphy',
					'Darkrai',
					'Shaymin',
					'Arceus',
					'Victini',
					'Snivy',
					'Servine',
					'Serperior',
					'Tepig',
					'Pignite',
					'Emboar',
					'Oshawott',
					'Dewott',
					'Samurott',
					'Patrat',
					'Watchog',
					'Lillipup',
					'Herdier',
					'Stoutland',
					'Purrloin',
					'Liepard',
					'Pansage',
					'Simisage',
					'Pansear',
					'Simisear',
					'Panpour',
					'Simipour',
					'Munna',
					'Musharna',
					'Pidove',
					'Tranquill',
					'Unfezant',
					'Blitzle',
					'Zebstrika',
					'Roggenrola',
					'Boldore',
					'Gigalith',
					'Woobat',
					'Swoobat',
					'Drilbur',
					'Excadrill',
					'Audino',
					'Timburr',
					'Gurdurr',
					'Conkeldurr',
					'Tympole',
					'Palpitoad',
					'Seismitoad',
					'Throh',
					'Sawk',
					'Sewaddle',
					'Swadloon',
					'Leavanny',
					'Venipede',
					'Whirlipede',
					'Scolipede',
					'Cottonee',
					'Whimsicott',
					'Petilil',
					'Lilligant',
					'Basculin',
					'Sandile',
					'Krokorok',
					'Krookodile',
					'Darumaka',
					'Darmanitan',
					'Maractus',
					'Dwebble',
					'Crustle',
					'Scraggy',
					'Scrafty',
					'Sigilyph',
					'Yamask',
					'Cofagrigus',
					'Tirtouga',
					'Carracosta',
					'Archen',
					'Archeops',
					'Trubbish',
					'Garbodor',
					'Zorua',
					'Zoroark',
					'Minccino',
					'Cinccino',
					'Gothita',
					'Gothorita',
					'Gothitelle',
					'Solosis',
					'Duosion',
					'Reuniclus',
					'Ducklett',
					'Swanna',
					'Vanillite',
					'Vanillish',
					'Vanilluxe',
					'Deerling',
					'Sawsbuck',
					'Emolga',
					'Karrablast',
					'Escavalier',
					'Foongus',
					'Amoonguss',
					'Frillish',
					'Jellicent',
					'Alomomola',
					'Joltik',
					'Galvantula',
					'Ferroseed',
					'Ferrothorn',
					'Klink',
					'Klang',
					'Klinklang',
					'Tynamo',
					'Eelektrik',
					'Eelektross',
					'Elgyem',
					'Beheeyem',
					'Litwick',
					'Lampent',
					'Chandelure',
					'Axew',
					'Fraxure',
					'Haxorus',
					'Cubchoo',
					'Beartic',
					'Cryogonal',
					'Shelmet',
					'Accelgor',
					'Stunfisk',
					'Mienfoo',
					'Mienshao',
					'Druddigon',
					'Golett',
					'Golurk',
					'Pawniard',
					'Bisharp',
					'Bouffalant',
					'Rufflet',
					'Braviary',
					'Vullaby',
					'Mandibuzz',
					'Heatmor',
					'Durant',
					'Deino',
					'Zweilous',
					'Hydreigon',
					'Larvesta',
					'Volcarona',
					'Cobalion',
					'Terrakion',
					'Virizion',
					'Tornadus',
					'Thundurus',
					'Reshiram',
					'Zekrom',
					'Landorus',
					'Kyurem',
					'Keldeo',
					'Meloetta',
					'Genesect',
					'Chespin',
					'Quilladin',
					'Chesnaught',
					'Fennekin',
					'Braixen',
					'Delphox',
					'Froakie',
					'Frogadier',
					'Greninja',
					'Bunnelby',
					'Diggersby',
					'Fletchling',
					'Fletchinder',
					'Talonflame',
					'Scatterbug',
					'Spewpa',
					'Vivillon',
					'Litleo',
					'Pyroar',
					'Flabébé',
					'Floette',
					'Florges',
					'Skiddo',
					'Gogoat',
					'Pancham',
					'Pangoro',
					'Furfrou',
					'Espurr',
					'Meowstic',
					'Honedge',
					'Doublade',
					'Aegislash',
					'Spritzee',
					'Aromatisse',
					'Swirlix',
					'Slurpuff',
					'Inkay',
					'Malamar',
					'Binacle',
					'Barbaracle',
					'Skrelp',
					'Dragalge',
					'Clauncher',
					'Clawitzer',
					'Helioptile',
					'Heliolisk',
					'Tyrunt',
					'Tyrantrum',
					'Amaura',
					'Aurorus',
					'Sylveon',
					'Hawlucha',
					'Dedenne',
					'Carbink',
					'Goomy',
					'Sliggoo',
					'Goodra',
					'Klefki',
					'Phantump',
					'Trevenant',
					'Pumpkaboo',
					'Gourgeist',
					'Bergmite',
					'Avalugg',
					'Noibat',
					'Noivern',
					'Xerneas',
					'Yveltal',
					'Zygarde',
					'Diancie',
					'Hoopa',
					'Volcanion',
					'Rowlet',
					'Dartrix',
					'Decidueye',
					'Litten',
					'Torracat',
					'Incineroar',
					'Popplio',
					'Brionne',
					'Primarina',
					'Pikipek',
					'Trumbeak',
					'Toucannon',
					'Yungoos',
					'Gumshoos',
					'Grubbin',
					'Charjabug',
					'Vikavolt',
					'Crabrawler',
					'Crabominable',
					'Oricorio',
					'Cutiefly',
					'Ribombee',
					'Rockruff',
					'Lycanroc',
					'Wishiwashi',
					'Mareanie',
					'Toxapex',
					'Mudbray',
					'Mudsdale',
					'Dewpider',
					'Araquanid',
					'Fomantis',
					'Lurantis',
					'Morelull',
					'Shiinotic',
					'Salandit',
					'Salazzle',
					'Stufful',
					'Bewear',
					'Bounsweet',
					'Steenee',
					'Tsareena',
					'Comfey',
					'Oranguru',
					'Passimian',
					'Wimpod',
					'Golisopod',
					'Sandygast',
					'Palossand',
					'Pyukumuku',
					'Type: Null',
					'Silvally',
					'Minior',
					'Komala',
					'Turtonator',
					'Togedemaru',
					'Mimikyu',
					'Bruxish',
					'Drampa',
					'Dhelmise',
					'Jangmo-o',
					'Hakamo-o',
					'Kommo-o',
					'Tapu Koko',
					'Tapu Lele',
					'Tapu Bulu',
					'Tapu Fini',
					'Cosmog',
					'Cosmoem',
					'Solgaleo',
					'Lunala',
					'Nihilego',
					'Buzzwole',
					'Pheromosa',
					'Xurkitree',
					'Celesteela',
					'Kartana',
					'Guzzlord',
					'Necrozma',
					'Magearna',
					'Marshadow',
					'Poipole',
					'Naganadel',
					'Stakataka',
					'Blacephalon',
					'Zeraora',
					'Meltan',
					'Melmetal',
					'Grookey',
					'Thwackey',
					'Rillaboom',
					'Scorbunny',
					'Raboot',
					'Cinderace',
					'Sobble',
					'Drizzile',
					'Inteleon',
					'Skwovet',
					'Greedent',
					'Rookidee',
					'Corvisquire',
					'Corviknight',
					'Blipbug',
					'Dottler',
					'Orbeetle',
					'Nickit',
					'Thievul',
					'Gossifleur',
					'Eldegoss',
					'Wooloo',
					'Dubwool',
					'Chewtle',
					'Drednaw',
					'Yamper',
					'Boltund',
					'Rolycoly',
					'Carkol',
					'Coalossal',
					'Applin',
					'Flapple',
					'Appletun',
					'Silicobra',
					'Sandaconda',
					'Cramorant',
					'Arrokuda',
					'Barraskewda',
					'Toxel',
					'Toxtricity',
					'Sizzlipede',
					'Centiskorch',
					'Clobbopus',
					'Grapploct',
					'Sinistea',
					'Polteageist',
					'Hatenna',
					'Hattrem',
					'Hatterene',
					'Impidimp',
					'Morgrem',
					'Grimmsnarl',
					'Obstagoon',
					'Perrserker',
					'Cursola',
					"Sirfetch'd",
					'Mr. Rime',
					'Runerigus',
					'Milcery',
					'Alcremie',
					'Falinks',
					'Pincurchin',
					'Snom',
					'Frosmoth',
					'Stonjourner',
					'Eiscue',
					'Indeedee',
					'Morpeko',
					'Cufant',
					'Copperajah',
					'Dracozolt',
					'Arctozolt',
					'Dracovish',
					'Arctovish',
					'Duraludon',
					'Dreepy',
					'Drakloak',
					'Dragapult',
					'Zacian',
					'Zamazenta',
					'Eternatus',
					'Kubfu',
					'Urshifu',
					'Zarude',
					'Regieleki',
					'Regidrago',
					'Glastrier',
					'Spectrier',
					'Calyrex',
					'Wyrdeer',
					'Kleavor',
					'Ursaluna',
					'Basculegion',
					'Sneasler',
					'Overqwil',
					'Enamorus',
					'Sprigatito',
					'Floragato',
					'Meowscarada',
					'Fuecoco',
					'Crocalor',
					'Skeledirge',
					'Quaxly',
					'Quaxwell',
					'Quaquaval',
					'Lechonk',
					'Oinkologne',
					'Tarountula',
					'Spidops',
					'Nymble',
					'Lokix',
					'Pawmi',
					'Pawmo',
					'Pawmot',
					'Tandemaus',
					'Maushold',
					'Fidough',
					'Dachsbun',
					'Smoliv',
					'Dolliv',
					'Arboliva',
					'Squawkabilly',
					'Nacli',
					'Naclstack',
					'Garganacl',
					'Charcadet',
					'Armarouge',
					'Ceruledge',
					'Tadbulb',
					'Bellibolt',
					'Wattrel',
					'Kilowattrel',
					'Maschiff',
					'Mabosstiff',
					'Shroodle',
					'Grafaiai',
					'Bramblin',
					'Brambleghast',
					'Toedscool',
					'Toedscruel',
					'Klawf',
					'Capsakid',
					'Scovillain',
					'Rellor',
					'Rabsca',
					'Flittle',
					'Espathra',
					'Tinkatink',
					'Tinkatuff',
					'Tinkaton',
					'Wiglett',
					'Wugtrio',
					'Bombirdier',
					'Finizen',
					'Palafin',
					'Varoom',
					'Revavroom',
					'Cyclizar',
					'Orthworm',
					'Glimmet',
					'Glimmora',
					'Greavard',
					'Houndstone',
					'Flamigo',
					'Cetoddle',
					'Cetitan',
					'Veluza',
					'Dondozo',
					'Tatsugiri',
					'Annihilape',
					'Clodsire',
					'Farigiraf',
					'Dudunsparce',
					'Kingambit',
					'Great Tusk',
					'Scream Tail',
					'Brute Bonnet',
					'Flutter Mane',
					'Slither Wing',
					'Sandy Shocks',
					'Iron Treads',
					'Iron Bundle',
					'Iron Hands',
					'Iron Jugulis',
					'Iron Moth',
					'Iron Thorns',
					'Frigibax',
					'Arctibax',
					'Baxcalibur',
					'Gimmighoul',
					'Gholdengo',
					'Wo-Chien',
					'Chien-Pao',
					'Ting-Lu',
					'Chi-Yu',
					'Roaring Moon',
					'Iron Valiant',
					'Koraidon',
					'Miraidon',
					'Walking Wake',
					'Iron Leaves',
				]

				await insertWords(db, 'pokemon', words)
			}
			//#endregion
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
