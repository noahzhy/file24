function randomUser(prefix) {
    prefix === undefined ? prefix = "" : prefix;

    // user name dictionary
    let nameArr = [
        // 
        // animals
        [
            'fox', 'bull', 'bird', 'dog', 'cat', 'pig', 'fish', 'snake', 'tiger',
            'lion', 'bear', 'wolf', 'rabbit', 'mouse', 'monkey', 'horse', 'sheep',
            'elephant', 'dragon', 'cow', 'goat', 'deer', 'duck', 'chicken', 'frog',
            'crab', 'shrimp', 'lobster', 'whale', 'dolphin', 'octopus', 'squid',
            'starfish', 'snail', 'ant', 'beetle', 'butterfly', 'dragonfly', 'mosquito',
            'fly', 'bee', 'ladybug', 'spider', 'scorpion', 'cockroach', 'lizard',
            'turtle', 'toad', 'salamander', 'chameleon', 'alligator', 'crocodile',
            'dinosaur', 'penguin', 'walrus', 'panda', 'koala', 'gorilla', 'ape',
            'chimpanzee', 'orangutan', 'lemur', 'squirrel', 'chipmunk', 'hare',
            'rat', 'hamster', 'gerbil', 'gopher', 'beaver', 'otter', 'mole', 'vole',
            'porcupine', 'hedgehog', 'coyote', 'hyena', 'jackal', 'leopard', 'cheetah',
            'jaguar', 'panther', 'cougar', 'lynx', 'bobcat', 'kangaroo', 'wallaby',
            'wombat', 'opossum', 'kookaburra', 'emu', 'ostrich', 'rhea', 'kiwi',
            'albatross', 'pelican', 'cormorant', 'heron', 'stork', 'crane', 'flamingo',
            'swan', 'goose', 'oyster', 'clam', 'mussel', 'slug', 'porpoise', 'seal',
            'shark', 'ray', 'stingray', 'eel', 'newt', 'tortoise', 'chinchilla',
        ],
        // english name
        [
            'Aaron', 'Abraham', 'Adam', 'Adrian', 'Alan', 'Albert', 'Alberto', 'Alejandro',
            'Alex', 'Alexander', 'Alfonso', 'Alfred', 'Alfredo', 'Allan', 'Allen', 'Alton',
            'Alvin', 'Andre', 'Andres', 'Andrew', 'Andy', 'Angel', 'Angelo', 'Anthony',
            'Antonio', 'Archie', 'Armando', 'Arnold', 'Arthur', 'Arturo', 'Austin', 'Barry',
            'Ben', 'Benjamin', 'Bennie', 'Benny', 'Bernard', 'Bill', 'Billy', 'Blake', 'Bob',
            'Bobby', 'Brad', 'Bradley', 'Brandon', 'Brent', 'Brett', 'Brian', 'Bruce', 'Bryan',
            'Byron', 'Calvin', 'Cameron', 'Carl', 'Carlos', 'Carlton', 'Casey', 'Cecil',
            'Cedric', 'Cesar', 'Chad', 'Charles', 'Charlie', 'Chester', 'Chris', 'Christian',
            'Christopher', 'Clarence', 'Claude', 'Clayton', 'Clifford', 'Clifton', 'Clinton',
            'Clyde', 'Cody', 'Colin', 'Corey', 'Cory', 'Craig', 'Curtis', 'Dale', 'Damon',
            'Dan', 'Dana', 'Daniel', 'Danny', 'Darrell', 'Darren', 'Darryl', 'Daryl', 'Dave',
            'David', 'Dean', 'Delbert', 'Dennis', 'Derek', 'Derrick', 'Devin', 'Dominic', 'Don',
            'Donald', 'Donnie', 'Doug', 'Douglas', 'Duane', 'Dustin', 'Dwayne', 'Dwight', 'Earl',
            'Earnest', 'Ed', 'Eddie', 'Edgar', 'Edmund', 'Eduardo', 'Edward', 'Edwin', 'Elmer',
            'Enrique', 'Eric', 'Erik', 'Ernest', 'Ernesto', 'Eugene', 'Evan', 'Everett', 'Felipe',
            'Felix', 'Fernando', 'Floyd', 'Francis', 'Francisco', 'Frank', 'Franklin', 'Fred',
            'Freddie', 'Frederick', 'Fredrick', 'Gabriel', 'Garrett', 'Garry', 'Gary', 'Gene',
            'Geoffrey', 'George', 'Gerald', 'Gerard', 'Gerardo', 'Gilbert', 'Glen', 'Glenn',
            'Gordon', 'Grant', 'Greg', 'Gregg', 'Gregory', 'Guillermo', 'Guy', 'Harold', 'Harry',
            'Harvey', 'Hector', 'Henry', 'Herbert', 'Herman', 'Homer', 'Horace', 'Howard',
            'Hubert', 'Hugh', 'Ian', 'Ira', 'Isaac', 'Ivan', 'Jack', 'Jackie', 'Jacob', 'Jaime',
            'James', 'Jamie', 'Jared', 'Jason', 'Javier', 'Jay', 'Jean', 'Jeff', 'Jeffery',
            'Jeffrey', 'Jeremiah', 'Jeremy', 'Jerome', 'Jerry', 'Jesse', 'Jessie', 'Jesus',
            'Jim', 'Jimmie', 'Jimmy', 'Joe', 'Joel', 'Joey', 'John', 'Johnathan', 'Johnnie',
            'Johnny', 'Jon', 'Jonathan', 'Jonathon', 'Jordan', 'Jorge', 'Jose', 'Joseph',
            'Joshua', 'Juan', 'Julian', 'Julio', 'Julius', 'Justin', 'Karl', 'Keith', 'Kelly',
            'Kelvin', 'Ken', 'Kenneth', 'Kenny', 'Kent', 'Kerry', 'Kevin', 'Kim', 'Kirk', 'Kurt',
            'Kyle', 'Lance', 'Larry', 'Lawrence', 'Lee', 'Leo', 'Leon', 'Leonard', 'Leroy',
            'Leslie', 'Lester', 'Lewis', 'Lloyd', 'Lonnie', 'Loren', 'Lorenzo', 'Louis', 'Lowell',
            'Lucas', 'Luis', 'Luke', 'Luther', 'Lyle', 'Lynn', 'Malcolm', 'Manuel', 'Marc',
            'Marco', 'Marcus', 'Mario', 'Marion', 'Mark', 'Marshall', 'Martin', 'Marvin',
            'Mathew', 'Matt', 'Matthew', 'Maurice', 'Max', 'Melvin', 'Michael', 'Micheal',
            'Miguel', 'Mike', 'Milton', 'Mitchell', 'Morris', 'Myron', 'Nathan', 'Nathaniel',
            'Neal', 'Neil', 'Nelson', 'Nicholas', 'Nick', 'Noel', 'Norman', 'Oliver', 'Omar',
            'Orlando', 'Oscar', 'Otis', 'Pablo', 'Patrick', 'Paul', 'Pedro', 'Perry', 'Pete',
            'Peter', 'Philip', 'Phillip', 'Preston', 'Rafael', 'Ralph', 'Ramon', 'Randall',
            'Randolph', 'Randy', 'Raul', 'Ray', 'Raymond', 'Reginald', 'Rene', 'Rex', 'Ricardo',
            'Richard', 'Rick', 'Rickey', 'Ricky', 'Robert', 'Roberto', 'Robin', 'Roderick',
            'Rodney', 'Rodolfo', 'Roger', 'Roland', 'Ron', 'Ronald', 'Ronnie', 'Roosevelt',
            'Ross', 'Roy', 'Ruben', 'Rudolph', 'Rudy', 'Russell', 'Ryan', 'Salvador', 'Salvatore',
            'Sam', 'Samuel', 'Scott', 'Sean', 'Sergio', 'Seth', 'Shane', 'Shannon', 'Shaun',
            'Shawn', 'Sherman', 'Sidney', 'Spencer', 'Stanley', 'Stephen', 'Steve', 'Steven',
            'Stuart', 'Sylvester', 'Ted', 'Terrance', 'Terrence', 'Terry', 'Theodore', 'Thomas',
            'Tim', 'Timothy', 'Todd', 'Tom', 'Tommy', 'Tony', 'Tracy', 'Travis', 'Trevor', 'Troy',
            'Tyler', 'Tyrone', 'Vernon', 'Victor', 'Vincent', 'Virgil', 'Wade', 'Wallace', 'Walter',
            'Warren', 'Wayne', 'Wendell', 'Wesley', 'Wilbur', 'Willard', 'William', 'Willie',
            'Willis', 'Wilson', 'Wm', 'Zachary',
        ],
        // numbers
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ]

    let name = prefix;

    let animal = nameArr[0][Math.floor(Math.random() * nameArr[0].length)];
    let number = nameArr[1][Math.floor(Math.random() * nameArr[1].length)];

    // get random index
    let index = Math.floor(Math.random() * nameArr.length);

    name += animal + number;

    return name;
}
