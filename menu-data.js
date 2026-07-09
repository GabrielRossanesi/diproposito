/* -------------------------------------------------------------
   FONTE ÚNICA DE DADOS DO CARDÁPIO
   Usada tanto pela home (script.js) quanto pela página /cardapio
   (cardapio.js). Alterar um item aqui reflete nas duas páginas.
   O campo "id" é a chave estável usada pelo carrinho.
------------------------------------------------------------- */
const MENU_ITEMS = [
  {
    id: "duplo-bacon",
    name: "Duplo Bacon",
    description: "Hambúrguer artesanal com dois blends suculentos, queijo derretido e muito bacon crocante.",
    image: "img/Food/optimized/duplo-bacon-2.jpg",
    category: "Lanches",
    badge: "Mais Pedido"
  },
  {
    id: "espeto-carne",
    name: "Espeto de Carne",
    description: "Espeto clássico de carne bovina selecionada, macia, suculenta e assada na brasa.",
    image: "img/Food/optimized/carne-2.jpg",
    category: "Espetos",
    badge: "Na Brasa"
  },
  {
    id: "jantinha-medalhao-frango",
    name: "Jantinha de Medalhão de Frango",
    description: "Espeto de medalhão de frango com bacon, servido com arroz, feijão tropeiro saboroso, vinagrete fresco e mandioca.",
    image: "img/Food/optimized/jantinha-medalhao-de-frango-2.jpg",
    category: "Jantinhas",
    badge: "Mais Completa"
  },
  {
    id: "aneis-cebola",
    name: "Anéis de Cebola",
    description: "Porção super crocante, dourada por fora e macia por dentro. Perfeita para petiscar.",
    image: "img/Food/optimized/aneis-de-cebola-2.jpg",
    category: "Porções",
    badge: "Para Compartilhar"
  },
  {
    id: "medalhao-queijo",
    name: "Medalhão de Queijo",
    description: "Espeto de queijo coalho cremoso envolto em fatias crocantes de bacon na churrasqueira.",
    image: "img/Food/optimized/medalhao-de-queijo.jpg",
    category: "Espetos",
    badge: "Sucesso"
  },
  {
    id: "x-tudo",
    name: "X-Tudo",
    description: "Lanche monstro completo com hambúrguer artesanal, ovo, bacon, queijo, presunto, alface, tomate e maionese.",
    image: "img/Food/optimized/xtudo.jpg",
    category: "Lanches",
    badge: "Gigante"
  },
  {
    id: "espeto-frango",
    name: "Espeto de Frango",
    description: "Espetinho de peito de frango marinado em tempero especial da casa, macio e dourado na brasa.",
    image: "img/Food/optimized/espeto-de-frango-2.jpg",
    category: "Espetos",
    badge: "Tradicional"
  },
  {
    id: "pao-alho",
    name: "Pão de Alho",
    description: "Pão recheado com pasta cremosa de alho e ervas, grelhado até ficar dourado e crocante.",
    image: "img/Food/optimized/pao-de-alho-2.jpg",
    category: "Porções",
    badge: "Favorito"
  },
  {
    id: "kafta",
    name: "Kafta",
    description: "Espeto de carne moída temperada com hortelã e especiarias árabes, grelhado na brasa.",
    image: "img/Food/optimized/kafta-2.jpg",
    category: "Espetos",
    badge: ""
  },
  {
    id: "linguica",
    name: "Linguiça",
    description: "Espeto de linguiça toscana tradicional, bem assada por fora e suculenta por dentro.",
    image: "img/Food/optimized/linguica-2.jpg",
    category: "Espetos",
    badge: ""
  },
  {
    id: "linguica-apimentada",
    name: "Linguiça Apimentada",
    description: "Espeto de linguiça com toque de pimenta artesanal, grelhado para realçar o sabor picante.",
    image: "img/Food/optimized/linguica-apimentada-2.jpg",
    category: "Espetos",
    badge: "Picante"
  },
  {
    id: "fraldinha",
    name: "Fraldinha",
    description: "Hambúrguer artesanal de fraldinha suculenta grelhada na brasa, com queijo, salada fresca e maionese da casa no pão brioche.",
    image: "img/Food/optimized/fraldinha-2.jpg",
    category: "Lanches",
    badge: "Premium"
  },
  {
    id: "camarao",
    name: "Camarão",
    description: "Espeto de camarão grelhado na churrasqueira, temperado na medida certa com limão e ervas.",
    image: "img/Food/optimized/camarao-2.jpg",
    category: "Espetos",
    badge: "Especial"
  },
  {
    id: "x-bacon",
    name: "X-Bacon",
    description: "Hambúrguer artesanal suculento com queijo derretido, bacon crocante, maionese artesanal no pão brioche.",
    image: "img/Food/optimized/xbacon.jpg",
    category: "Lanches",
    badge: ""
  },
  {
    id: "x-salada",
    name: "X-Salada",
    description: "Hambúrguer artesanal com queijo derretido, alface fresca, tomate, cebola e maionese especial.",
    image: "img/Food/optimized/x-salada-2.jpg",
    category: "Lanches",
    badge: ""
  },
  {
    id: "jantinha-camarao",
    name: "Jantinha de Camarão",
    description: "Prato completo com espeto de camarão, arroz soltinho, feijão tropeiro caseiro, vinagrete e mandioca cozida.",
    image: "img/Food/optimized/jantinha-camarao-2.jpg",
    category: "Jantinhas",
    badge: "Especial"
  },
  {
    id: "medalhao-carne",
    name: "Medalhão de Carne",
    description: "Espeto de cubos de carne premium envoltos em fatias crocantes de bacon grelhado.",
    image: "img/Food/optimized/medalhao-de-carne-2.jpg",
    category: "Espetos",
    badge: ""
  },
  {
    id: "medalhao-frango",
    name: "Medalhão de Frango",
    description: "Espeto de cubos de frango marinados envoltos em fatias crocantes de bacon assados na brasa.",
    image: "img/Food/optimized/medalhao-de-frango.jpg",
    category: "Espetos",
    badge: ""
  },
  {
    id: "queijo-coalho",
    name: "Queijo Coalho",
    description: "Espeto de queijo coalho premium tostado por fora, derretendo por dentro.",
    image: "img/Food/optimized/queijo-2.jpg",
    category: "Espetos",
    badge: ""
  },
  {
    id: "tulipa-frango",
    name: "Tulipa de Frango",
    description: "Espeto de meio da asa de frango (tulipa) bem temperado e dourado na brasa.",
    image: "img/Food/optimized/tulipa-2.jpg",
    category: "Espetos",
    badge: ""
  }
];
