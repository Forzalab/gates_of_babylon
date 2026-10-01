CXX ?= g++
CXXFLAGS ?= -std=c++17 -Wall -Wextra -O2

circuit: main.cpp
	$(CXX) $(CXXFLAGS) -o $@ main.cpp

clean:
	rm -f circuit

.PHONY: clean
