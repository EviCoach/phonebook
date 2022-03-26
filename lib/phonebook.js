/* Trie Data Structure */

class Node {
    constructor() {
        this.keys = new Map();
        this.end = false;
        this.data = null;
    }

    setEnd() {
        this.end = true;
    };
    setData(val) {
        this.data = val.number;
        return this._normalizeData(val);
    }
    removeData() {
        this.data = null;
    }
    isEnd() {
        return this.end;
    };

    _normalizeData(val) {
        val.email = val.email.toLowerCase();
        val.name = val.name.toLowerCase();
        val.createAt = Date.now();
        return val;
    }
};

// class Contact {
//     constructor() {
//         this.name = null;
//         this.email = null;
//         this.number = null;
//         this.createAt = Date.now();
//     }
// }

class TriePhonebook {

    constructor() {
        this.root = new Node();
        this.store = new Map();
    }

    saveContact(contact) {
        let { name } = contact;
        if (!name) return "Name is required";
        name = name.toLowerCase();
        let root = this.root;
        let store = this.store;

        let add = function (input, node = root) {
            if (input.length == 0) {
                const currentContact = store.get(node.data);
                if (currentContact && currentContact.name === contact.name) {
                    console.log("Contact with same name already exists");
                    return;
                }
                if (currentContact && currentContact.email === contact.email) {
                    console.log("Contact with same email already exists");
                    return;
                }

                if (currentContact && currentContact.number === contact.number) {
                    console.log("Contact with same number already exists");
                    return;
                }

                node.setEnd();

                store.set(contact.number, node.setData(contact));
                return;
            } else if (!node.keys.has(input[0])) {
                node.keys.set(input[0], new Node());
                return add(input.substr(1), node.keys.get(input[0]));
            } else {
                return add(input.substr(1), node.keys.get(input[0]));
            };
        };

        add(name);
    }


    findByName(name) {
        const node = this.findNode(name.toLowerCase());
        if (!node) return false;
        return node.data;
    }

    findNode(name) {
        if (!name) return "Name is required";
        name = name.toLowerCase();
        let root = this.root;
        let store = this.store;

        let isWord = function (word) {
            let node = root;
            while (word.length > 1) {
                if (!node.keys.has(word[0])) {
                    return false;
                } else {
                    node = node.keys.get(word[0]);
                    word = word.substr(1);
                };
            };

            return (node.keys.has(word) && node.keys.get(word).isEnd()) ?
                node.keys.get(word) : false;
        };
        return isWord(name);

    }

    findByNumber(number) {
        if (!this.store.has(number)) return "Contact does not exist";
        return this.store.get(number);
    }

    delete(contact) {
        // find the contact with this name
        // if not found
        // find contact with number
        // and remove it
        if (!this.store.has(contact.number)) return "Contact does not exist";
        const contactNode = this.findNode(contact.name)
        if (!contactNode) return "Contact does not exist";
        contactNode.removeData();
        contactNode.setEnd(false);
        return this.store.delete(contact.number);
    }

    allContacts() {
        let words = new Array();
        let store = this.store;
        let search = function (node, string) {
            if (node.keys.size != 0) {
                for (let letter of node.keys.keys()) {
                    search(node.keys.get(letter), string.concat(letter));
                };
                if (node.isEnd() && node.data) {
                    words.push(store.get(node.data));
                };
            }
            else {
                string.length > 0 && node.data ? words.push(store.get(node.data)) : undefined;
                return;
            };
        };
        search(this.root, new String());
        return words.length > 0 ? words : [];
    };

};

myTrie = new TriePhonebook()
myTrie.saveContact({ name: "Nice One", number: "0810123456", email: "email@mail.com" });
myTrie.saveContact({ name: "John Doe", number: "0810123476", email: "gmail@mail.com" });
myTrie.saveContact({ name: "Mercy Chinenye", number: "0810123470", email: "chi@mail.com" });
myTrie.saveContact({ name: "Mercy Chinenye", number: "0810123470", email: "chi@mail.com" });


console.log("Find by name: Nice One", myTrie.findByName('Nice One'));
console.log("Find by number: 0810123476", myTrie.findByNumber('0810123476'));
console.log("All contacts ", myTrie.allContacts())

console.log("Deleting one contact, name: Nice One: ", myTrie.delete({ name: "Nice One", number: "0810123456", email: "email@mail.com" }))
console.log("Deleting one contact, name:Brook: ", myTrie.delete({ name: "Brook", number: "08103533332", email: "smail@gmail.com" }));

console.log("All contacts ", myTrie.allContacts())