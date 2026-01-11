import requests
import sys
from datetime import datetime
import json

class JungleChicAPITester:
    def __init__(self, base_url="https://jungle-swimwear.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.test_product_id = None
        self.test_order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list) and len(response_data) > 0:
                        print(f"   Response: {len(response_data)} items returned")
                    elif isinstance(response_data, dict):
                        if 'message' in response_data:
                            print(f"   Message: {response_data['message']}")
                        elif 'token' in response_data:
                            print(f"   Token received: {response_data['token'][:20]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_products_api(self):
        """Test Products API endpoints"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS API")
        print("="*50)
        
        # Test get all products
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "api/products",
            200
        )
        
        if success and response:
            products = response
            if len(products) > 0:
                self.test_product_id = products[0]['id']
                print(f"   Found {len(products)} products")
                print(f"   First product: {products[0]['name']} - {products[0]['price']}€")
            else:
                print("   No products found - may need to seed database")
        
        # Test get featured products
        success, response = self.run_test(
            "Get Featured Products",
            "GET",
            "api/products?featured=true",
            200
        )
        
        if success and response:
            featured = response
            print(f"   Found {len(featured)} featured products")
        
        # Test get specific product
        if self.test_product_id:
            success, response = self.run_test(
                "Get Product Details",
                "GET",
                f"api/products/{self.test_product_id}",
                200
            )
            
            if success and response:
                product = response
                print(f"   Product: {product['name']}")
                print(f"   Colors: {product['colors']}")
                print(f"   Sizes: {product['sizes']}")

    def test_auth_api(self):
        """Test Authentication API endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION API")
        print("="*50)
        
        # Test user registration
        test_user_data = {
            "email": "test@jungle.com",
            "password": "Test123!",
            "first_name": "Marie",
            "last_name": "Dupont"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data=test_user_data
        )
        
        if success and response:
            self.token = response.get('token')
            user = response.get('user')
            if user:
                self.user_id = user['id']
                print(f"   User created: {user['first_name']} {user['last_name']}")
                print(f"   Email: {user['email']}")
        
        # Test user login
        login_data = {
            "email": "test@jungle.com",
            "password": "Test123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data=login_data
        )
        
        if success and response:
            self.token = response.get('token')
            user = response.get('user')
            if user:
                print(f"   Login successful for: {user['email']}")
        
        # Test get current user
        if self.token:
            success, response = self.run_test(
                "Get Current User",
                "GET",
                "api/auth/me",
                200
            )
            
            if success and response:
                user = response
                print(f"   Current user: {user['first_name']} {user['last_name']}")

    def test_cart_api(self):
        """Test Cart API endpoints"""
        print("\n" + "="*50)
        print("TESTING CART API")
        print("="*50)
        
        if not self.token:
            print("❌ No authentication token - skipping cart tests")
            return
        
        # Test get empty cart
        success, response = self.run_test(
            "Get Cart (Empty)",
            "GET",
            "api/cart",
            200
        )
        
        if success and response:
            cart = response
            print(f"   Cart items: {len(cart.get('items', []))}")
        
        # Test add item to cart
        if self.test_product_id:
            # First get product details to get available colors
            product_response = requests.get(
                f"{self.base_url}/api/products/{self.test_product_id}",
                headers={'Authorization': f'Bearer {self.token}'}
            )
            
            if product_response.status_code == 200:
                product = product_response.json()
                first_color = product['colors'][0] if product['colors'] else "Vert jungle"
                
                cart_item = {
                    "product_id": self.test_product_id,
                    "size": "M",
                    "color": first_color,
                    "quantity": 1
                }
                
                success, response = self.run_test(
                    "Add Item to Cart",
                    "POST",
                    "api/cart/add",
                    200,
                    data=cart_item
                )
                
                # Test get cart with items
                success, response = self.run_test(
                    "Get Cart (With Items)",
                    "GET",
                    "api/cart",
                    200
                )
                
                if success and response:
                    cart = response
                    items = cart.get('items', [])
                    print(f"   Cart items: {len(items)}")
                    if items:
                        item = items[0]
                        print(f"   Item: {item['product_id']} - Size: {item['size']} - Color: {item['color']}")
                
                # Test update cart item
                cart_item['quantity'] = 2
                success, response = self.run_test(
                    "Update Cart Item",
                    "POST",
                    "api/cart/update",
                    200,
                    data=cart_item
                )
                
                # Test remove item from cart
                success, response = self.run_test(
                    "Remove Item from Cart",
                    "DELETE",
                    f"api/cart/remove/{self.test_product_id}/M/{first_color}",
                    200
                )

    def test_orders_api(self):
        """Test Orders API endpoints"""
        print("\n" + "="*50)
        print("TESTING ORDERS API")
        print("="*50)
        
        if not self.token:
            print("❌ No authentication token - skipping orders tests")
            return
        
        # First add an item to cart for order creation
        if self.test_product_id:
            product_response = requests.get(
                f"{self.base_url}/api/products/{self.test_product_id}",
                headers={'Authorization': f'Bearer {self.token}'}
            )
            
            if product_response.status_code == 200:
                product = product_response.json()
                first_color = product['colors'][0] if product['colors'] else "Vert jungle"
                
                cart_item = {
                    "product_id": self.test_product_id,
                    "size": "M",
                    "color": first_color,
                    "quantity": 1
                }
                
                # Add item to cart
                requests.post(
                    f"{self.base_url}/api/cart/add",
                    json=cart_item,
                    headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json'}
                )
        
        # Test create order
        shipping_address = {
            "first_name": "Marie",
            "last_name": "Dupont",
            "address": "123 Rue de la Plage",
            "city": "Nice",
            "postal_code": "06000",
            "country": "France",
            "phone": "+33123456789"
        }
        
        success, response = self.run_test(
            "Create Order",
            "POST",
            "api/orders",
            200,
            data=shipping_address
        )
        
        if success and response:
            order = response
            self.test_order_id = order['id']
            print(f"   Order created: {order['id']}")
            print(f"   Total amount: {order['total_amount']}€")
            print(f"   Items: {len(order['items'])}")
        
        # Test get user orders
        success, response = self.run_test(
            "Get User Orders",
            "GET",
            "api/orders",
            200
        )
        
        if success and response:
            orders = response
            print(f"   Found {len(orders)} orders")
            if orders:
                order = orders[0]
                print(f"   Latest order: {order['id']} - {order['total_amount']}€")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Jungle Chic API Tests")
        print(f"Backend URL: {self.base_url}")
        
        try:
            self.test_products_api()
            self.test_auth_api()
            self.test_cart_api()
            self.test_orders_api()
        except Exception as e:
            print(f"\n❌ Test suite error: {str(e)}")
        
        # Print final results
        print("\n" + "="*50)
        print("TEST RESULTS SUMMARY")
        print("="*50)
        print(f"📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            failed = self.tests_run - self.tests_passed
            print(f"❌ {failed} tests failed")
            return 1

def main():
    tester = JungleChicAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())