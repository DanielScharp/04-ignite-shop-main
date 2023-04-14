import axios from "axios";// Importa a biblioteca axios, que permite fazer requisições HTTP
import { GetStaticPaths, GetStaticProps } from "next" // Importa os tipos GetStaticPaths e GetStaticProps do framework Next.js
import Image from "next/future/image";// Importa o componente Image do Next.js
import Head from "next/head";// Importa o componente Head do Next.js, usado para definir o título da página
import { useState } from "react";// Importa o hook useState do React
import Stripe from "stripe";// Importa a biblioteca Stripe, usada para integrar com o serviço de pagamentos Stripe
import { stripe } from "../../lib/stripe";// Importa a instância do Stripe criada no arquivo stripe.ts
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product" // Importa alguns componentes estilizados para serem usados na página

interface ProductProps {
  // Define a interface ProductProps, 
  // que descreve as propriedades do produto a serem exibidas na página
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {// Define o componente Product, que recebe as propriedades do produto como parâmetro
  
  // Define o estado isCreatingCheckoutSession, que é usado para indicar se está sendo criada uma sessão de checkout no momento
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyButton() {// Define a função handleBuyButton, que é chamada quando o botão "Comprar agora" é clicado
    try {
      // Define o estado isCreatingCheckoutSession como true, para indicar que está sendo criada uma sessão de checkout
      setIsCreatingCheckoutSession(true);

      // Faz uma requisição HTTP para a rota /api/checkout, enviando o ID do preço do produto como parâmetro
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;// Extrai a URL da sessão de checkout da resposta da requisição

      window.location.href = checkoutUrl;// Redireciona o usuário para a página de checkout do Stripe
    } catch (err) {
      // Define o estado isCreatingCheckoutSession como false, indicando que não está mais sendo criada uma sessão de checkout
      setIsCreatingCheckoutSession(false);

      // Exibe um alerta informando que houve uma falha ao redirecionar para a página de checkout
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

// Exportamos a função responsável por gerar os caminhos para as páginas estáticas
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // `paths` é um array de objetos que representam os caminhos para as páginas estáticas que serão geradas.
    paths: [
      { params: { id: 'prod_MLH5Wy0Y97hDAC' } },
    ],
    // `fallback` é uma string que define o comportamento da página caso o usuário tente acessar uma página que ainda não foi gerada.
    fallback: 'blocking',
  }
}

// Exportamos a função responsável por buscar os dados do produto e retorná-los para a página estática
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;

  // Aqui usamos a API Stripe para buscar o produto com o ID extraído anteriormente.
  // Estamos passando uma opção `expand` para incluir informações sobre o preço padrão do produto.
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });

  // Aqui extraímos o preço padrão do produto e fazemos um type cast para a interface `Stripe.Price`.
  const price = product.default_price as Stripe.Price;

  return {
    // `props` é um objeto que contém as informações do produto que serão passadas para a página estática.
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount / 100),// Formata o preço do produto para o formato de moeda brasileiro
        description: product.description,
        defaultPriceId: price.id
      }
    },
    // `revalidate` é um número em segundos que define quanto tempo o servidor deve esperar antes de buscar novamente as informações do produto.
    // Nesse caso, estamos definindo um tempo de 1 hora.
    revalidate: 60 * 60 * 1 
  }
}
