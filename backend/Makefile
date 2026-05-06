CXX ?= c++
CXXFLAGS := -std=c++17 -Wall -Wextra -O2
TARGET := smart-commerce-api
SRC := src/main.cpp

.PHONY: all run clean

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET)
