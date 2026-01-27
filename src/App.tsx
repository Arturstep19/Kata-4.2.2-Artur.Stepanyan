import { useState, useEffect } from 'react';
import {
  Container,
  Group,
  Text,
  Button,
  Card,
  Image,
  Stack,
  Popover,
  Badge,
  Grid,
  Skeleton,
} from '@mantine/core';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [cart, setCart] = useState<Record<number, number>>({});
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [id]: newValue };
    });
  };

  const addToCart = (id: number) => {
    const quantity = quantities[id] || 0;
    if (quantity > 0) {
      setCart((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + quantity,
      }));
      setQuantities((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce((sum, product) => {
    const qty = cart[product.id] || 0;
    return sum + qty * product.price;
  }, 0);

  return (
    <>
      {/* Header */}
      <Group
        justify="space-between"
        p="md"
        style={{
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 100,
        }}
      >
        <Group gap="xs">
          <Text fw={700} size="xl">
            Vegetable
          </Text>
          <Badge color="green" size="lg">
            SHOP
          </Badge>
        </Group>

        {/* Cart */}
        <Popover
          opened={opened}
          onChange={setOpened}
          position="bottom-end"
          withArrow
          shadow="md"
          width={300}
          zIndex={2000}
        >
          <Popover.Target>
            <Button variant="filled" color="green" onClick={() => setOpened(!opened)}>
              {totalItems} Cart 🛒
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            {totalItems === 0 ? (
              <Text c="dimmed">Your cart is empty</Text>
            ) : (
              <Stack>
                {products
                  .filter((p) => cart[p.id] > 0)
                  .map((product) => (
                    <Group key={product.id} justify="space-between">
                      <Text>{product.name} × {cart[product.id]}</Text>
                      <Text>${(product.price * cart[product.id]).toFixed(2)}</Text>
                    </Group>
                  ))}
                <Text size="lg" fw={700} ta="right">
                  Total: ${totalPrice.toFixed(2)}
                </Text>
              </Stack>
            )}
          </Popover.Dropdown>
        </Popover>
      </Group>

      {/* Products */}
      <Container size="lg" py="xl">
        {loading ? (
          <Grid>
            {[...Array(6)].map((_, i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                <Skeleton height={220} radius="md" />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Grid>
            {products.map((product) => (
              <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{ transition: 'transform 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    height={120}
                    fit="cover"
                  />
                  <Stack mt="xs" gap={4}>
                    <Text fw={600} size="sm" lineClamp={1}>
                      {product.name}
                    </Text>
                    <Text c="dimmed" size="sm">${product.price}</Text>
                    <Group justify="center" gap="xs" mt="auto">
                      <Button
                        size="compact-xs"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        –
                      </Button>
                      <Text fw={600}>{quantities[product.id] || 0}</Text>
                      <Button
                        size="compact-xs"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        +
                      </Button>
                    </Group>
                    <Button
                      fullWidth
                      color="green"
                      size="xs"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to cart
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}