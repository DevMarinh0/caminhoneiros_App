import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../../utils/config';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}>
        <View style={styles.voltarContainer}>
          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => [
              styles.botaoCircular,
              pressed && styles.botaoCircularAtivo
            ]}
          >
            <Ionicons name="arrow-back" size={isTablet ? 36 : 28} color="#023e8a" />
          </Pressable>
        </View>
        <Ionicons name="list" size={isTablet ? 72 : 48} color="#023e8a" style={{ marginBottom: isTablet ? 20 : 10 }} />
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
                onPress={async () => {
                  const url = `${API_URL}/pdf/${c.id}`;
                  if (Platform.OS === 'web') {
                    window.open(url, '_blank');
                  } else {
                    try {
                      Alert.alert(
                        "Download iniciado",
                        "O PDF está sendo baixado, aguarde um momento..."
                      );

                      // Usar o diretório de cache que é acessível para compartilhamento
                      const fileUri = FileSystem.cacheDirectory + `cadastro_${c.id}.pdf`;

                      // Baixar o arquivo
                      await FileSystem.downloadAsync(url, fileUri);
                      console.log('Arquivo baixado para:', fileUri);

                      // Verificar se o compartilhamento está disponível
                      const isAvailable = await Sharing.isAvailableAsync();

                      if (isAvailable) {
                        // Compartilhar o arquivo (permite salvar em Downloads)
                        await Sharing.shareAsync(fileUri, {
                          mimeType: 'application/pdf',
                          dialogTitle: `Cadastro ${c.id}`,
                          UTI: 'com.adobe.pdf' // para iOS
                        });
                      } else {
                        // Fallback para dispositivos que não suportam compartilhamento
                        Alert.alert(
                          "Visualizar PDF",
                          "O PDF foi baixado, mas não é possível compartilhá-lo neste dispositivo.",
                          [
                            {
                              text: "OK",
                              onPress: () => Linking.openURL(url)
                            }
                          ]
                        );
                      }
                    } catch (error) {
                      console.error('Erro ao processar o PDF:', error);
                      Alert.alert(
                        "Erro",
                        "Ocorreu um erro ao processar o PDF. Tentando método alternativo...",
                        [
                          {
                            text: "OK",
                            onPress: () => Linking.openURL(url)
                          }
                        ]
                      );
                    }
                  }
                }}
              >
                <Ionicons name="document" size={isTablet ? 28 : 22} color="#fff" />
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
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#78BBFF',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 50, // Adiciona espaço extra no final para dispositivos menores
  },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 40,
  },
  titulo: {
    fontSize: isTablet ? 36 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: isTablet ? 32 : 24,
    textAlign: 'center',
    width: isTablet ? '80%' : '100%',
  },
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
    alignSelf: 'center', // Garante centralização em diferentes tamanhos de tela
  },
  nome: {
    fontSize: isTablet ? 26 : 20,
    fontWeight: 'bold',
    color: '#023e8a',
    marginBottom: isTablet ? 10 : 6
  },
  info: {
    fontSize: isTablet ? 20 : 16,
    color: '#023e8a',
    marginBottom: isTablet ? 4 : 2
  },
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    width: '100%', // Garante que o container ocupe toda a largura disponível
  },
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
    width: isTablet ? 60 : 48,
    height: isTablet ? 60 : 48,
    borderRadius: isTablet ? 30 : 24,
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
    paddingVertical: isTablet ? 14 : 10,
    borderRadius: isTablet ? 12 : 8,
    marginTop: isTablet ? 14 : 10,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  botaoPDFAtivo: {
    backgroundColor: '#fe0702',
  },
  textoBotaoPDF: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: isTablet ? 12 : 8,
    fontSize: isTablet ? 20 : 16,
  },
});