import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

//const API_URL = 'http://localhost:3333';
const API_URL = 'http://192.168.0.25:3333'; 

export default function CadastroMotorista() {
  const [transportadora, setTransportadora] = useState('');
  const [nome, setNome] = useState('');
  const [placa, setPlaca] = useState('');
  const [destino, setDestino] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);
  const [dataCadastro, setDataCadastro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    setDataCadastro(`${dia}/${mes}/${ano}`);
  }, []);

  async function escolherFotos() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      const novas = result.assets.map((asset) => asset.uri);
      setFotos([...fotos, ...novas].slice(0, 6)); // limite de 6
    }
  }

  async function uploadFotosSelecionadas(): Promise<string[]> {
    if (fotos.length === 0) return [];
    const formData = new FormData();
    fotos.forEach((uri, idx) => {
      const nomeArquivo = uri.split('/').pop() || `foto${idx}.jpg`;
      formData.append('fotos', {
        uri,
        name: nomeArquivo,
        type: 'image/jpeg',
      } as any);
    });
    const resp = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!resp.ok) throw new Error('Erro ao fazer upload das fotos');
    const data = await resp.json();
    return data.urls || [];
  }

  async function salvarCadastro() {
    if (!transportadora || !nome || !placa || !destino) {
      Alert.alert('Preencha todos os campos!');
      return;
    }
    setCarregando(true);
    try {
      let urlsFotos: string[] = [];
      if (fotos.length > 0) {
        urlsFotos = await uploadFotosSelecionadas();
      }
      const novoCadastro = {
        transportadora,
        nome,
        placa,
        destino,
        fotos: urlsFotos,
        dataCadastro,
      };
      const resp = await fetch(`${API_URL}/cadastros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCadastro),
      });
      if (!resp.ok) throw new Error('Erro ao salvar cadastro');
      setTransportadora('');
      setNome('');
      setPlaca('');
      setDestino('');
      setFotos([]);
      setFotoSelecionada(null);
      setDataCadastro('');
      // Atualiza a data para o dia atual novamente
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano = hoje.getFullYear();
      setDataCadastro(`${dia}/${mes}/${ano}`);
      Alert.alert('Cadastro salvo com sucesso!');
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro ao salvar cadastro');
    } finally {
      setCarregando(false);
    }
  }

  //const dadosCompletos = transportadora.trim() && nome.trim() && placa.trim() && destino.trim() && fotos.length > 0 && dataCadastro;

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
        <Ionicons name="person-add" size={48} color="#023e8a" style={{ marginBottom: 10 }} />
        <Text style={styles.titulo}>Cadastro de Motorista</Text>
        <TextInput placeholder="Transportadora" style={styles.input} value={transportadora} onChangeText={setTransportadora} />
        <TextInput placeholder="Nome Completo do Motorista" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput placeholder="Placa do Cavalo" style={styles.input} value={placa} onChangeText={setPlaca} />
        <TextInput placeholder="Destino" style={styles.input} value={destino} onChangeText={setDestino} />
        <TextInput placeholder="Data do Cadastro" style={styles.input} value={dataCadastro} editable={false} />
        <View style={styles.botaoContainer}>
          <Button title="Selecionar até 6 fotos" color="#0077b6" onPress={escolherFotos} />
        </View>
        <View style={styles.fotosContainer}>
          {fotos.map((uri, index) => (
            <Pressable key={index} onPress={() => setFotoSelecionada(uri)}>
              <Image source={{ uri }} style={styles.foto} />
            </Pressable>
          ))}
        </View>
        <View style={styles.botaoContainer}>
          <Button title={carregando ? 'Salvando...' : 'Salvar Cadastro'} color="#023e8a" onPress={salvarCadastro} disabled={carregando} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, alignItems: 'center', backgroundColor: '#78BBFF', flex: 1, justifyContent: 'center' },
  voltarContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24, textAlign: 'center' },
  input: {
    width: isTablet ? '70%' : '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#90e0ef',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  botaoContainer: { width: isTablet ? '70%' : '100%', marginBottom: 16 },
  fotosContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' },
  foto: { width: isTablet ? 120 : 80, height: isTablet ? 120 : 80, margin: 5, borderRadius: 10, borderWidth: 1, borderColor: '#032E64' },
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
});