import { useEffect, useState } from 'react';
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
  Divider,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchVegetables, updateQuantity, addToCart } from './store/slices/vegetableSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const { products, loading, error, quantities, cart } = useAppSelector((state) => state.vegetables);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    dispatch(fetchVegetables());
  }, [dispatch]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce((sum, product) => {
    const qty = cart[product.id] || 0;
    return sum + qty * product.price;
  }, 0);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Ошибка: {error}</div>;
  }

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

        {/* Cart Popover */}
        <Popover
          opened={opened}
          onChange={setOpened}
          position="bottom-end"
          withArrow
          shadow="md"
          width={300}
        >
          <Popover.Target>
            <Button 
              variant="filled" 
              color="green" 
              onClick={() => setOpened((o) => !o)}
            >
              {totalItems} Cart 🛒
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            {totalItems === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Your cart is empty
              </Text>
            ) : (
              <Stack gap="xs">
                {products
                  .filter((p) => cart[p.id] > 0)
                  .map((product) => (
                    <Group key={product.id} justify="space-between">
                      <Text size="sm">
                        {product.name} × {cart[product.id]}
                      </Text>
                      <Text size="sm" fw={500}>
                        ${(product.price * cart[product.id]).toFixed(2)}
                      </Text>
                    </Group>
                  ))}
                <Divider my="xs" />
                <Group justify="space-between">
                  <Text fw={600}>Total:</Text>
                  <Text fw={700}>${totalPrice.toFixed(2)}</Text>
                </Group>
              </Stack>
            )}
          </Popover.Dropdown>
        </Popover>
      </Group>

      {/* Products Grid */}
      <Container size="lg" py="xl">
        {loading ? (
          <Grid>
            {[...Array(6)].map((_, i) => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                <Skeleton height={280} radius="md" />
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
                  <Card.Section>
                    <Image
                      src={product.image}
                      alt={product.name}
                      height={160}
                      fit="cover"
                      fallbackSrc="https://placehold.co/400x300?text=No+Image"
                    />
                  </Card.Section>

                  <Stack mt="md" gap="xs">
                    <Group justify="space-between" align="center">
                      <Text fw={600} size="lg">
                        {product.name}
                      </Text>
                      <Badge color="green" size="lg">
                        ${product.price}
                      </Badge>
                    </Group>

                    <Group justify="center" gap="xs" mt="sm">
                      <Button
                        size="xs"
                        variant="outline"
                        color="gray"
                        onClick={() => dispatch(updateQuantity({ id: product.id, delta: -1 }))}
                      >
                        –
                      </Button>
                      <Text fw={700} size="lg" w={40} ta="center">
                        {quantities[product.id] || 0}
                      </Text>
                      <Button
                        size="xs"
                        variant="outline"
                        color="gray"
                        onClick={() => dispatch(updateQuantity({ id: product.id, delta: 1 }))}
                      >
                        +
                      </Button>
                    </Group>

                    <Button
                      fullWidth
                      color="green"
                      mt="sm"
                      onClick={() => dispatch(addToCart(product.id))}
                      disabled={!quantities[product.id]}
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