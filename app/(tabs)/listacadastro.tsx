import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
//const API_URL = 'http://localhost:3333';
const API_URL = 'http://192.168.0.25:3333'; 

export default function ListaCadastro() {
  const [cadastros, setCadastros] = useState<any[]>([]);
  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const buscarCadastros = async () => {
      try {
        const response = await fetch(`${API_URL}/cadastros`);
        const data = await response.json();
        setCadastros(data);
      } catch {
        setCadastros([]);
      }
    };
    buscarCadastros();
    const interval = setInterval(buscarCadastros, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Modal
        visible={!!fotoSelecionada}
        transparent
        animationType="fade"
        onRequestClose={() => setFotoSelecionada(null)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackground} onPress={() => setFotoSelecionada(null)} />
          <View style={styles.modalContent}>
            {fotoSelecionada && (
              <Image source={{ uri: fotoSelecionada }} style={styles.fotoGrande} resizeMode="contain" />
            )}
            <Pressable onPress={() => setFotoSelecionada(null)}>
              <Text style={styles.fechar}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, minHeight: '100%' }]}>
        <View style={styles.voltarContainer}>
          <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [
            styles.botaoCircular,
            pressed && styles.botaoCircularAtivo
          ]}
        >
        <Ionicons name="arrow-back" size={28} color="#023e8a" />
        </Pressable>
      </View>
        <Ionicons name="list" size={48} color="#023e8a" style={{ marginBottom: 10 }} />
        <Text style={styles.titulo}>Todos os Cadastros</Text>
        {cadastros.length === 0 && <Text style={styles.info}>Nenhum cadastro encontrado</Text>}
        {cadastros.map((c, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.nome}>{c.nome}</Text>
            <Text style={styles.info}>Transportadora: {c.transportadora}</Text>
            <Text style={styles.info}>Placa do Cavalo: {c.placa}</Text>
            <Text style={styles.info}>Destino: {c.destino}</Text>
            <Text style={styles.info}>Data do Cadastro: {c.dataCadastro}</Text>
            <View style={styles.fotosContainer}>
              {c.fotos.map((foto: any, i: number) => (
                <Pressable
                  key={i}
                  onPress={() => setFotoSelecionada(foto.url.startsWith('http') ? foto.url : `${API_URL}${foto.url}`)}
                >
                  <Image source={{ uri: foto.url.startsWith('http') ? foto.url : `${API_URL}${foto.url}` }} style={styles.foto} />
                </Pressable>
              ))}
            </View>
            <View style={styles.botaoContainer}>
              <Pressable
                style={({ pressed }) => [styles.botaoPDF, pressed && styles.botaoPDFAtivo]}
                onPress={() => {
                  const url = `${API_URL}/pdf/${c.id}`;
                  if (Platform.OS === 'web') {
                    window.open(url, '_blank');
                  } else {
                    Linking.openURL(url);
                  }
                }}
              >
                <Ionicons name="document" size={22} color="#fff" />
                <Text style={styles.textoBotaoPDF}>Gerar PDF</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', backgroundColor: '#78BBFF', flexGrow: 1, flex: 1, justifyContent: 'flex-start', },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 40,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    width: isTablet ? '70%' : '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#023e8a', marginBottom: 6 },
  info: { fontSize: 16, color: '#023e8a', marginBottom: 2 },
  fotosContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  foto: { width: isTablet ? 120 : 80, height: isTablet ? 120 : 80, borderRadius: 8, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#90e0ef' },
  // Estilos do modal:
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    maxWidth: '90%',
    maxHeight: '80%',
  },
  fotoGrande: {
    width: isTablet ? 500 : 300,
    height: isTablet ? 500 : 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  fechar: {
    color: '#023e8a',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  botaoCircular: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
botaoCircularAtivo: {
  backgroundColor: '#90e0ef',
},
botaoContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 10,
},
botaoPDF: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#b40000',
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 10,
  paddingHorizontal: 16,
},
botaoPDFAtivo: {
  backgroundColor: '#fe0702',
},
textoBotaoPDF: {
  color: '#fff',
  fontWeight: 'bold',
  marginLeft: 8,
  fontSize: 16,
},
});