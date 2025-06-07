import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Botao from '../../components/Botao';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#023e8a" />
      <Ionicons name="home" size={48} color="#023e8a" style={{ marginBottom: 10 }} />
      <Text style={styles.titulo}>Caminhoneiros App</Text>
      <Text style={styles.subtitulo}>Escolha uma opção:</Text>
      <Botao texto="Buscar por Placa" onPress={() => router.push('/buscaplaca')} />
      <Botao texto="Cadastrar Motorista" onPress={() => router.push('/cadastromotorista')} />
      <Botao texto="Listar Motorista" onPress={() => router.push('/listacadastro')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#78BBFF', // azul bem claro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#032E64', // azul escuro
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#032E64', // azul claro
    marginBottom: 30,
    textAlign: 'center',
  },
});