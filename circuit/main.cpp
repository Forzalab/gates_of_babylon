// Gates of Babylon: simulate a logic block built from simple gates.
#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

namespace {

const char *const NAMES[] = {"NOT", "AND", "OR", "NAND", "NOR", "XOR"};
const int INPUT = -1;

struct Node {
    int type;             // INPUT or index into NAMES
    std::vector<int> in;  // input node indices
    int out = -1;         // node that consumes this one; -1 if none
};

[[noreturn]] void bad() {
    std::cout << "BAD INPUT!\n";
    std::exit(0);
}

int readInt(int lo, int hi) {
    std::string s;
    long v;
    size_t pos = 0;
    if (!(std::cin >> s)) bad();
    try {
        v = std::stol(s, &pos);
    } catch (...) {
        bad();
    }
    if (pos != s.size() || v < lo || v > hi) bad();
    return static_cast<int>(v);
}

int readPin(std::vector<Node> &nodes, const char *what) {
    std::cout << "Give the index for the " << what << ":\n";
    int i = readInt(0, static_cast<int>(nodes.size()) - 1);
    if (nodes[i].out != -1) bad();
    return i;
}

bool eval(int type, const std::vector<bool> &v) {
    bool a = v[0], b = v.size() > 1 && v[1];
    switch (type) {
        case 0: return !a;
        case 1: return a && b;
        case 2: return a || b;
        case 3: return !(a && b);
        case 4: return !(a || b);
        default: return a != b;
    }
}

void printCircuit(const std::vector<Node> &nodes) {
    for (size_t i = 0; i < nodes.size(); ++i) {
        const Node &n = nodes[i];
        std::cout << "Gate Type: " << (n.type == INPUT ? "INPUT" : NAMES[n.type]) << "\n"
                  << "\tInput Connected to Index: ";
        if (n.in.empty()) std::cout << "N.C. and N.C.";
        else if (n.in.size() == 1) std::cout << n.in[0];
        else std::cout << n.in[0] << " and " << n.in[1];
        std::cout << "\n\tOutput Connected to Index: ";
        if (i + 1 == nodes.size()) std::cout << "OUTPUT PIN";
        else std::cout << n.out;
        std::cout << "\n\tValue: X\n\n";
    }
}

void printTruthTable(const std::vector<Node> &nodes, int pins) {
    std::cout << "Input Pins (Numbers), Output Pin (O):\n";
    for (int i = 0; i < pins; ++i) std::cout << i << "|";
    std::cout << "O\n";
    for (long row = (1L << pins) - 1; row >= 0; --row) {
        std::vector<bool> val(nodes.size());
        for (int i = 0; i < pins; ++i) {
            val[i] = (row >> (pins - 1 - i)) & 1;
            std::cout << val[i] << "|";
        }
        for (size_t i = pins; i < nodes.size(); ++i) {
            std::vector<bool> args;
            for (int j : nodes[i].in) args.push_back(val[j]);
            val[i] = eval(nodes[i].type, args);
        }
        std::cout << val.back() << "\n";
    }
}

}  // namespace

int main() {
    std::cout << "Welcome to the Gates of Babylon!\n"
                 "How many inputs does your logic block have? (1 to 10)\n";
    int pins = readInt(1, 10);
    std::vector<Node> nodes(pins, Node{INPUT, {}, -1});

    for (;;) {
        std::cout << "What sort of gate do you want to add?\n"
                     "0 - NOT, 1 - AND, 2 - OR, 3 - NAND, 4 - NOR, 5 - XOR, 6 - DONE\n";
        int type = readInt(0, 6);
        if (type == 6) break;
        Node g{type, {}, -1};
        int self = static_cast<int>(nodes.size());
        if (type == 0) {
            g.in.push_back(readPin(nodes, "input"));
            nodes[g.in[0]].out = self;
        } else {
            g.in.push_back(readPin(nodes, "first input"));
            nodes[g.in[0]].out = self;  // mark now so a repeated index is rejected
            g.in.push_back(readPin(nodes, "second input"));
            nodes[g.in[1]].out = self;
        }
        nodes.push_back(g);
    }

    if (static_cast<int>(nodes.size()) == pins) bad();
    for (size_t i = 0; i + 1 < nodes.size(); ++i)
        if (nodes[i].out == -1) bad();

    std::cout << "\n1) Print Circuit Block or 2) Print Truth Table\n";
    if (readInt(1, 2) == 1) printCircuit(nodes);
    else printTruthTable(nodes, pins);
}
