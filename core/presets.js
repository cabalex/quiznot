// Only really a preview, don't modify; {} if it doesn't exist
const userPresetTerms = localStorage.getItem('userPresetTerms') ?
    JSON.parse(localStorage.getItem('userPresetTerms')) : {};

const presetTerms = {
    ...userPresetTerms,        
    "Literary Devices": {
        "Alliteration": "A series of words in quick succession that all start with the same letter or sound.",
        "Allusion": "A passing or indirect descriptive reference to something.",
        "Analogy": "A comparison based on the resemblance in some particular ways between things that are otherwise unlike.",
        "Antagonist": "The person or force that works against the hero of the story.",
        "Characterization": "The description of the characters or nature or somebody or something; the act of describing distinctive characteristics or essential features.",
        "Connotation": "The set of associations implied by a word in addition to its literal meaning.",
        "Flashback": "The insertion of an earlier event into the normal chronological sequence of a narrative.",
        "Foreshadowing": "The use of clues to give readers a hint of events that will occur later on.",
        "Hyperbole": "An obvious and intentional exaggeration.",
        "Imagery": "The use of vivid or figurative language to represent objects, actions, or ideas.",
        "Irony": "A technique that uses a word is phrases to mean the exact opposite of its normal meaning.",
        "Metaphor": "A figure of speech that compares two things without using the word like or as.",
        "Onomatopoeia": "the naming of a thing or action by a vocal imitation of the sound associated with it.",
        "Personification": "A figure of speech in which a non-human thing (an idea, object, mammal) is given human characteristics.",
        "Simile": "a figure of speech that compares two things using the word like or as.",
        "Symbolism": "A concrete or real object used to represent an idea."
    },
    "Biology": {
        "Biology": "The study of living organisms",
        "Deoxyribonucleic acid": "The scientific name for DNA",
        "Scientific Method": "Observation, Question, Hypothesis, Experiment, Conclusion",
        "Charles Darwin": "The creator of the Theory of Evolution",
        "Eukaryote": "A cell that has a distinct nucleus",
        "Prokaryote": "A cell that does not have a distinct nucleus",
        "Mitochondria": "The powerhouse of the cell",
        "semipermeable": "A cell membrane is _____",
        "genes": "You inherit ____ from your parents",
        "46": "How many chromosomes does an individual person have",
        "Carbon": "What element do all living organisms have in common",
        "Glucose": "The most abundant monosaccharide, or sugar",
        "ATP": "The primary carrier of energy in cells",
        "Natural Selection": "The phrase ???survival of the fittest??? is an alternate way to express what",
        "Immigration": "The process in which organisms join a new population and leave their allele frequencies",
        "Emmigration": "The process in whichorganisms join a new population and bring their allele frequencies"
    },
    "Trigonometric Identities": {
        "1":"sin^2 x + cos^2 x",
        "sin 2x":"2 sin x cos x",
        "cos 2x":"cos^2 x - sin^2 x",
        "tan x":"sin x / cos x",
        "sec x":"1 / cos x",
        "csc x":"1 / sin x",
        "cot x":"1 / tan x",
        "sin x+y":"sin x cos y + cos x sin y",
        "cos x+y":"cos x cos y - sin x sin y",
        "sin x":"cos (pi/2 - x)",
        "cos x":"sin (pi/2 - x)",
        "sin x-y":"sin x cos y - cos x sin y",
        "cos x-y":"cos x cos y + sin x sin y",
        "tan 2x":"(2 tan x) / (1- tan^2 x)"
    },
    "US Citizenship Quiz": {
        "2":"The number of years in a term for a member of the House of Representatives",
        "4":"The number of years in a single term of a President of the United States",
        "6":"The number of years in a U.S. Senator's term",
        "9":"The number of seats currently on the Supreme Court",
        "14":"The ___th Amendment gives citizenship to all persons born in the U.S.",
        "19":"The ___th Amendment gave women the right to vote",
        "22":"The number of the Amendment that limits a president to two terms",
        "27":"The number of amendments in the U.S. Constitution",
        "100":"The number of U.S. Senators",
        "435":"The number of voting members in the House of Representatives",
        "1929":"What year did the Great Depression start?",
        "Constitution":"This founding document was written in 1787",
        "Republic":"The form of government of the United States",
        "Amendment":"A change made to the U.S. Constitution",
        "Legislative":"The ____ branch of government is the first branch, from Article I",
        "Executive":"The ____ branch of government is the second branch, from Article II",
        "Judicial":"The ___ branch of goverment is the third branch, from Article III",
        "Biden":"The last name of the current U.S. President",
        "Harris":"The last name of the current U.S. Vice President",
        "Jefferson":"He wrote the Declaration of Independence",
        "Hamilton":"The last name of the first Secretary of the Treasury",
        "Louisiana":"The ___ Territory was purchased from France in 1803",
        "Roosevelt":"The last name of the President during the Great Depression and WWII",
        "Civil":"The ___ War ended slavery",
        "Madison":"The last name of the 4th president, who also helped write the Federalist Papers"
    }
}