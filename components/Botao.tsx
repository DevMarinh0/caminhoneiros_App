import { Pressable, StyleSheet, Text } from 'react-native';

type BotaoProps = {
  texto: string;
  onPress: () => void;
};

export default function Botao({ texto, onPress }: BotaoProps) {
  return (
    <Pressable style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]} onPress={onPress}>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#023e8a', // azul escuro
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginVertical: 12,
    elevation: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  botaoPressionado: {
    backgroundColor: '#48cae4', // azul claro
    opacity: 0.85,
  },
  texto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});