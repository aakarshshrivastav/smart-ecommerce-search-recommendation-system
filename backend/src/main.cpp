#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <map>
#include <queue>
#include <set>
#include <sstream>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

struct Product {
  std::string id;
  std::string name;
  std::string category;
  int price;
  double rating;
  int popularity;
  std::string image;
  std::vector<std::string> tags;
  std::string description;
};

std::vector<Product> products = {
    {"shoe-velocity", "Velocity Knit Running Shoes", "Footwear", 1899, 4.8, 97,
     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
     {"shoes", "running", "sports", "fitness"}, "Breathable knit upper, cushioned stride, and city-ready traction."},
    {"shorts-airflow", "Airflow Training Shorts", "Apparel", 799, 4.4, 81,
     "https://images.unsplash.com/photo-1562887245-9b074594f1b6?auto=format&fit=crop&w=900&q=80",
     {"shorts", "training", "gym"}, "Lightweight stretch shorts for workouts and weekend movement."},
    {"bag-shoulder", "Metro Shoulder Bag", "Accessories", 1299, 4.6, 88,
     "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
     {"shoulder bag", "bag", "travel"}, "Compact daily carry with structured storage and premium texture."},
    {"phone-nova", "Nova X5 Smartphone", "Electronics", 24999, 4.7, 96,
     "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
     {"phone", "smartphone", "mobile"}, "AMOLED display, all-day battery, and a crisp computational camera."},
    {"charger-gan", "65W GaN Fast Charger", "Electronics", 1599, 4.5, 91,
     "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=900&q=80",
     {"charger", "phone charger", "adapter"}, "Pocketable fast charger for phones, tablets, and USB-C laptops."},
    {"earphones-buds", "Pulse Wireless Earphones", "Audio", 2199, 4.3, 86,
     "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
     {"earphones", "wireless", "audio"}, "Low-latency wireless sound with a compact charging case."},
    {"case-armour", "Clear Armour Phone Case", "Accessories", 599, 4.2, 78,
     "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80",
     {"phone case", "case", "cover"}, "Slim transparent protection with raised camera and screen edges."},
    {"watch-active", "ActiveFit Smart Watch", "Wearables", 3499, 4.4, 84,
     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
     {"watch", "smartwatch", "fitness"}, "Health metrics, workout modes, and notifications at a glance."},
    {"bottle-steel", "Hydra Steel Bottle", "Lifestyle", 499, 4.1, 72,
     "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
     {"bottle", "steel bottle", "travel"}, "Insulated everyday hydration with a clean matte finish."},
    {"laptop-aero", "AeroBook Pro Laptop", "Computing", 72999, 4.9, 93,
     "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
     {"laptop", "computer", "work"}, "Thin performance laptop for development, design, and multitasking."},
    {"mouse-glide", "Glide Wireless Mouse", "Computing", 999, 4.5, 79,
     "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
     {"mouse", "wireless mouse", "computer"}, "Silent clicks, precise tracking, and ergonomic all-day comfort."},
    {"keyboard-mech", "Tactile Mechanical Keyboard", "Computing", 2999, 4.6, 82,
     "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
     {"keyboard", "mechanical keyboard", "computer"}, "Responsive switches and compact layout for focused typing."}};

std::string lower(std::string text) {
  std::transform(text.begin(), text.end(), text.begin(), [](unsigned char c) { return std::tolower(c); });
  return text;
}

std::string escapeJson(const std::string &value) {
  std::ostringstream out;
  for (char c : value) {
    if (c == '"' || c == '\\') out << '\\' << c;
    else if (c == '\n') out << "\\n";
    else out << c;
  }
  return out.str();
}

std::string urlDecode(const std::string &value) {
  std::string result;
  for (size_t i = 0; i < value.size(); ++i) {
    if (value[i] == '%' && i + 2 < value.size()) {
      result += static_cast<char>(std::strtol(value.substr(i + 1, 2).c_str(), nullptr, 16));
      i += 2;
    } else if (value[i] == '+') {
      result += ' ';
    } else {
      result += value[i];
    }
  }
  return result;
}

struct TrieNode {
  std::map<char, TrieNode *> children;
  std::vector<const Product *> matches;
  ~TrieNode() {
    for (auto &child : children) delete child.second;
  }
};

struct Trie {
  TrieNode root;

  void insert(const std::string &word, const Product *product) {
    TrieNode *node = &root;
    for (char ch : lower(word)) {
      if (!node->children[ch]) node->children[ch] = new TrieNode();
      node = node->children[ch];
      node->matches.push_back(product);
    }
  }

  std::vector<const Product *> search(const std::string &prefix, int limit) const {
    const TrieNode *node = &root;
    for (char ch : lower(prefix)) {
      auto found = node->children.find(ch);
      if (found == node->children.end()) return {};
      node = found->second;
    }

    std::set<std::string> seen;
    std::vector<const Product *> result;
    for (const Product *product : node->matches) {
      if (seen.insert(product->id).second) result.push_back(product);
      if (static_cast<int>(result.size()) == limit) break;
    }
    return result;
  }
};

struct FenwickTree {
  std::vector<int> tree;
  explicit FenwickTree(int size) : tree(size + 1, 0) {}

  void add(int index, int value) {
    for (int i = index + 1; i < static_cast<int>(tree.size()); i += i & -i) tree[i] += value;
  }

  int sum(int index) const {
    int total = 0;
    for (int i = index + 1; i > 0; i -= i & -i) total += tree[i];
    return total;
  }

  int rangeSum(int left, int right) const {
    if (right < left) return 0;
    return sum(right) - (left > 0 ? sum(left - 1) : 0);
  }
};

class ProductGraph {
 public:
  void connect(const std::string &a, const std::string &b) {
    edges[a].insert(b);
    edges[b].insert(a);
  }

  std::vector<std::string> recommend(const std::string &start, int limit) const {
    auto found = edges.find(start);
    if (found == edges.end()) return {};

    std::set<std::string> visited{start};
    std::queue<std::string> queue;
    for (const auto &id : found->second) queue.push(id);

    std::vector<std::string> result;
    while (!queue.empty() && static_cast<int>(result.size()) < limit) {
      std::string current = queue.front();
      queue.pop();
      if (!visited.insert(current).second) continue;
      result.push_back(current);

      auto neighbors = edges.find(current);
      if (neighbors != edges.end()) {
        for (const auto &next : neighbors->second) {
          if (!visited.count(next)) queue.push(next);
        }
      }
    }
    return result;
  }

 private:
  std::unordered_map<std::string, std::set<std::string>> edges;
};

std::unordered_map<std::string, const Product *> productMap;
std::map<std::string, int> categoryCounts;
Trie trie;
ProductGraph graph;
const int priceBucket = 500;
int maxBucket = 0;
FenwickTree *fenwick = nullptr;

std::string productJson(const Product &product) {
  std::ostringstream out;
  out << "{\"id\":\"" << escapeJson(product.id) << "\",\"name\":\"" << escapeJson(product.name)
      << "\",\"category\":\"" << escapeJson(product.category) << "\",\"price\":" << product.price
      << ",\"rating\":" << product.rating << ",\"popularity\":" << product.popularity
      << ",\"image\":\"" << escapeJson(product.image) << "\",\"tags\":[";
  for (size_t i = 0; i < product.tags.size(); ++i) {
    if (i) out << ',';
    out << "\"" << escapeJson(product.tags[i]) << "\"";
  }
  out << "],\"description\":\"" << escapeJson(product.description) << "\"}";
  return out.str();
}

std::string productsJson(const std::vector<const Product *> &items) {
  std::ostringstream out;
  out << '[';
  for (size_t i = 0; i < items.size(); ++i) {
    if (i) out << ',';
    out << productJson(*items[i]);
  }
  out << ']';
  return out.str();
}

std::map<std::string, std::string> parseQuery(const std::string &target) {
  std::map<std::string, std::string> params;
  size_t q = target.find('?');
  if (q == std::string::npos) return params;

  std::stringstream stream(target.substr(q + 1));
  std::string pair;
  while (std::getline(stream, pair, '&')) {
    size_t equals = pair.find('=');
    std::string key = urlDecode(pair.substr(0, equals));
    std::string value = equals == std::string::npos ? "" : urlDecode(pair.substr(equals + 1));
    params[key] = value;
  }
  return params;
}

std::string pathOnly(const std::string &target) {
  size_t q = target.find('?');
  return q == std::string::npos ? target : target.substr(0, q);
}

int intParam(const std::map<std::string, std::string> &params, const std::string &key, int fallback) {
  auto found = params.find(key);
  if (found == params.end() || found->second.empty()) return fallback;
  return std::stoi(found->second);
}

std::string handleApi(const std::string &target, int &status) {
  status = 200;
  const std::string path = pathOnly(target);
  const auto params = parseQuery(target);

  if (path == "/api/health") return "{\"ok\":true,\"service\":\"Smart Commerce C++ API\"}";

  if (path == "/api/products") {
    std::vector<const Product *> items;
    for (const auto &product : products) items.push_back(&product);
    return productsJson(items);
  }

  if (path == "/api/categories") {
    std::ostringstream out;
    out << '[';
    size_t index = 0;
    for (const auto &[name, count] : categoryCounts) {
      if (index++) out << ',';
      out << "{\"name\":\"" << escapeJson(name) << "\",\"count\":" << count << '}';
    }
    out << ']';
    return out.str();
  }

  if (path == "/api/search") {
    auto query = params.count("q") ? params.at("q") : "";
    if (query.empty()) return "[]";
    return productsJson(trie.search(query, intParam(params, "limit", 8)));
  }

  if (path == "/api/top") {
    std::string mode = params.count("mode") ? params.at("mode") : "rating";
    int limit = intParam(params, "limit", 5);
    std::vector<const Product *> items;
    for (const auto &product : products) items.push_back(&product);

    auto compare = [mode](const Product *a, const Product *b) {
      if (mode == "cheap") return a->price > b->price;
      if (mode == "popular") return a->popularity < b->popularity;
      return a->rating < b->rating;
    };
    std::priority_queue<const Product *, std::vector<const Product *>, decltype(compare)> heap(compare);
    for (const Product *product : items) heap.push(product);

    std::vector<const Product *> result;
    while (!heap.empty() && static_cast<int>(result.size()) < limit) {
      result.push_back(heap.top());
      heap.pop();
    }
    return productsJson(result);
  }

  const std::string recommendationsPrefix = "/api/recommendations/";
  if (path.rfind(recommendationsPrefix, 0) == 0) {
    std::string id = path.substr(recommendationsPrefix.size());
    if (!productMap.count(id)) {
      status = 404;
      return "{\"message\":\"Product not found\"}";
    }

    std::vector<const Product *> result;
    for (const auto &nextId : graph.recommend(id, 6)) {
      if (productMap.count(nextId)) result.push_back(productMap[nextId]);
    }
    return productsJson(result);
  }

  if (path == "/api/range") {
    int min = intParam(params, "min", 0);
    int max = intParam(params, "max", 100000000);
    int left = std::max(0, min / priceBucket);
    int right = std::min(maxBucket, max / priceBucket);
    std::vector<const Product *> result;
    for (const auto &product : products) {
      if (product.price >= min && product.price <= max) result.push_back(&product);
    }

    std::ostringstream out;
    out << "{\"min\":" << min << ",\"max\":" << max << ",\"bucketStart\":" << left
        << ",\"bucketEnd\":" << right << ",\"indexedCount\":" << fenwick->rangeSum(left, right)
        << ",\"products\":" << productsJson(result) << '}';
    return out.str();
  }

  status = 404;
  return "{\"message\":\"Route not found\"}";
}

void initializeDsa() {
  for (const auto &product : products) {
    productMap[product.id] = &product;
    categoryCounts[product.category]++;
    trie.insert(product.name, &product);
    for (const auto &tag : product.tags) trie.insert(tag, &product);
    maxBucket = std::max(maxBucket, product.price / priceBucket);
  }

  fenwick = new FenwickTree(maxBucket + 1);
  for (const auto &product : products) fenwick->add(product.price / priceBucket, 1);

  graph.connect("phone-nova", "charger-gan");
  graph.connect("phone-nova", "earphones-buds");
  graph.connect("phone-nova", "case-armour");
  graph.connect("charger-gan", "laptop-aero");
  graph.connect("earphones-buds", "watch-active");
  graph.connect("laptop-aero", "mouse-glide");
  graph.connect("laptop-aero", "keyboard-mech");
  graph.connect("shoe-velocity", "shorts-airflow");
  graph.connect("shoe-velocity", "watch-active");
  graph.connect("bag-shoulder", "bottle-steel");
  graph.connect("bag-shoulder", "phone-nova");
}

void sendResponse(int client, int status, const std::string &body) {
  std::string statusText = status == 200 ? "OK" : status == 404 ? "Not Found" : "Error";
  std::ostringstream response;
  response << "HTTP/1.1 " << status << ' ' << statusText << "\r\n"
           << "Content-Type: application/json\r\n"
           << "Access-Control-Allow-Origin: *\r\n"
           << "Access-Control-Allow-Methods: GET, OPTIONS\r\n"
           << "Access-Control-Allow-Headers: Content-Type\r\n"
           << "Content-Length: " << body.size() << "\r\n"
           << "Connection: close\r\n\r\n"
           << body;
  std::string text = response.str();
  send(client, text.c_str(), text.size(), 0);
}

int main() {
  initializeDsa();

  int serverFd = socket(AF_INET, SOCK_STREAM, 0);
  if (serverFd < 0) {
    std::cerr << "Unable to create socket\n";
    return 1;
  }

  int opt = 1;
  setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  sockaddr_in address{};
  address.sin_family = AF_INET;
  address.sin_addr.s_addr = INADDR_ANY;
  address.sin_port = htons(4000);

  if (bind(serverFd, reinterpret_cast<sockaddr *>(&address), sizeof(address)) < 0) {
    std::cerr << "Port 4000 is already in use\n";
    close(serverFd);
    return 1;
  }

  if (listen(serverFd, 16) < 0) {
    std::cerr << "Unable to listen on socket\n";
    close(serverFd);
    return 1;
  }

  std::cout << "Smart Commerce C++ API running on http://localhost:4000\n";
  while (true) {
    int client = accept(serverFd, nullptr, nullptr);
    if (client < 0) continue;

    char buffer[4096] = {0};
    read(client, buffer, sizeof(buffer) - 1);
    std::stringstream request(buffer);
    std::string method;
    std::string target;
    request >> method >> target;

    int status = 200;
    std::string body = method == "OPTIONS" ? "{}" : handleApi(target, status);
    sendResponse(client, status, body);
    close(client);
  }
}
