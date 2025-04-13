import json
import sys
import os
import re

def process_question(question):
    """Processa a pergunta e retorna uma resposta"""
    
    # Carregar dados de eventos e notícias
    events = []
    news = []
    
    # Caminho base para os arquivos
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    
    # Carregar eventos
    try:
        events_path = os.path.join(base_dir, 'public', 'events_data.json')
        print(f"Tentando carregar eventos de: {events_path}", file=sys.stderr)
        
        if os.path.exists(events_path):
            with open(events_path, 'r', encoding='utf-8') as f:
                events = json.load(f)
                print(f"Carregados {len(events)} eventos", file=sys.stderr)
        else:
            print(f"Arquivo de eventos não encontrado em: {events_path}", file=sys.stderr)
    except Exception as e:
        print(f"Erro ao carregar eventos: {str(e)}", file=sys.stderr)
    
    # Carregar notícias
    try:
        news_path = os.path.join(base_dir, 'public', 'noticias_faro.json')
        print(f"Tentando carregar notícias de: {news_path}", file=sys.stderr)
        
        if os.path.exists(news_path):
            with open(news_path, 'r', encoding='utf-8') as f:
                news = json.load(f)
                print(f"Carregadas {len(news)} notícias", file=sys.stderr)
        else:
            print(f"Arquivo de notícias não encontrado em: {news_path}", file=sys.stderr)
    except Exception as e:
        print(f"Erro ao carregar notícias: {str(e)}", file=sys.stderr)
    
    # Lógica para responder perguntas
    question_lower = question.lower()
    print(f"Processando pergunta: {question_lower}", file=sys.stderr)
    
    # Perguntas sobre eventos
    if any(word in question_lower for word in ['evento', 'acontecendo', 'programação', 'agenda']):
        if len(events) == 0:
            return "Não tenho informações sobre eventos no momento."
        
        # Listar eventos
        if any(phrase in question_lower for phrase in ['listar', 'quais', 'mostrar']):
            event_list = "\n".join([f"- {event['title']} ({event['date']}{', ' + event['time'] if 'time' in event and event['time'] else ''} em {event['location']})" for event in events[:5]])
            return f"Aqui estão os próximos eventos em Faro:\n\n{event_list}\n\nEstes são apenas os 5 próximos eventos. Há um total de {len(events)} eventos disponíveis."
        
        # Buscar por categoria
        category_match = re.search(r'categoria\s+(\w+)', question_lower) or re.search(r'eventos\s+de\s+(\w+)', question_lower)
        if category_match:
            category = category_match.group(1)
            filtered_events = [event for event in events if 'category' in event and category.lower() in event['category'].lower()]
            
            if filtered_events:
                event_list = "\n".join([f"- {event['title']} ({event['date']})" for event in filtered_events[:3]])
                return f"Encontrei {len(filtered_events)} eventos na categoria '{category}':\n\n{event_list}"
            else:
                return f"Não encontrei eventos na categoria '{category}'."
        
        # Buscar por local
        if any(word in question_lower for word in ['local', 'onde']):
            locations = list(set([event['location'] for event in events if 'location' in event]))
            return f"Os eventos acontecem nos seguintes locais:\n\n{chr(10).join(locations)}"
        
        # Buscar por data
        if any(word in question_lower for word in ['quando', 'data']):
            # Ordenar eventos por data
            sorted_events = sorted(events, key=lambda x: x['date'] if 'date' in x else '9999-99-99')
            event_list = "\n".join([f"- {event['title']}: {event['date']}{', ' + event['time'] if 'time' in event and event['time'] else ''}" for event in sorted_events[:3]])
            return f"Os próximos eventos são:\n\n{event_list}"
        
        # Resposta genérica sobre eventos
        return f"Temos {len(events)} eventos disponíveis. Você pode perguntar sobre eventos por categoria, local ou data."
    
    # Perguntas sobre notícias
    if any(word in question_lower for word in ['notícia', 'jornal', 'informação', 'novidade']):
        if len(news) == 0:
            return "Não tenho informações sobre notícias no momento."
        
        # Listar notícias recentes
        if any(phrase in question_lower for phrase in ['recentes', 'últimas', 'atuais']):
            news_list = "\n".join([f"- {item['title']} ({item['source']['name'] if 'source' in item and 'name' in item['source'] else 'Fonte desconhecida'})" for item in news[:5]])
            return f"Aqui estão as notícias mais recentes sobre Faro:\n\n{news_list}"
        
        # Buscar por fonte
        if any(word in question_lower for word in ['fonte', 'jornal']):
            sources = list(set([item['source']['name'] for item in news if 'source' in item and 'name' in item['source']]))
            return f"As notícias são de diversas fontes, incluindo:\n\n{chr(10).join(sources)}"
        
        # Buscar por tema
        keywords = ['cultura', 'esporte', 'política', 'economia', 'turismo', 'farense']
        for keyword in keywords:
            if keyword in question_lower:
                filtered_news = [
                    item for item in news 
                    if (keyword in item['title'].lower()) or 
                       ('description' in item and item['description'] and keyword in item['description'].lower())
                ]
                
                if filtered_news:
                    news_list = "\n".join([f"- {item['title']}" for item in filtered_news[:3]])
                    return f"Encontrei {len(filtered_news)} notícias sobre '{keyword}':\n\n{news_list}"
                else:
                    return f"Não encontrei notícias específicas sobre '{keyword}'."
        
        # Resposta genérica sobre notícias
        return f"Tenho {len(news)} notícias disponíveis sobre Faro e região. Você pode perguntar sobre notícias recentes ou por temas específicos como cultura, esporte, política, etc."
    
    # Perguntas sobre o site/aplicação
    if any(word in question_lower for word in ['site', 'aplicação', 'ligafaro', 'plataforma']):
        if 'o que é' in question_lower or 'sobre o site' in question_lower:
            return 'O LigaFaro é uma plataforma que conecta os cidadãos de Faro a informações locais, eventos, notícias e serviços comunitários. Nossa missão é fortalecer a comunidade local através da informação e participação.'
        
        if 'funcionalidades' in question_lower or 'o que posso fazer' in question_lower:
            return 'No LigaFaro você pode:\n\n- Consultar eventos locais\n- Ler notícias sobre Faro e região\n- Participar do fórum comunitário\n- Acessar o marketplace local\n- Encontrar oportunidades de voluntariado'
        
        if 'contato' in question_lower or 'suporte' in question_lower:
            return 'Para entrar em contato conosco, envie um email para contato@ligafaro.pt ou utilize o formulário de contato disponível no site.'
        
        return 'O LigaFaro é sua plataforma comunitária para Faro. Posso ajudar com informações sobre eventos, notícias locais e funcionalidades do site.'
    
    # Verificar se é uma pergunta sobre o tempo
    if any(word in question_lower for word in ['tempo', 'clima']):
        from datetime import datetime
        import pytz
        
        # Obter a data e hora atual em Faro (Europe/Lisbon)
        faro_tz = pytz.timezone('Europe/Lisbon')
        agora = datetime.now(faro_tz)
        data_hora_faro = agora.strftime('%A, %d de %B de %Y às %H:%M')
        
        return f'A temperatura atual em Faro é de aproximadamente 22°C, com céu parcialmente nublado. Agora são {data_hora_faro} em Faro, Portugal.'
    
    # Verificar se é uma pergunta sobre data ou hora
    if 'que dia é hoje' in question_lower or 'data' in question_lower or 'hora' in question_lower or 'horas' in question_lower:
        from datetime import datetime
        import pytz
        
        # Obter a data e hora atual em Faro (Europe/Lisbon)
        faro_tz = pytz.timezone('Europe/Lisbon')
        agora = datetime.now(faro_tz)
        
        if 'hora' in question_lower or 'horas' in question_lower:
            hora_faro = agora.strftime('%H:%M')
            return f'Agora são {hora_faro} em Faro, Portugal.'
        else:
            data_faro = agora.strftime('%A, %d de %B de %Y')
            return f'Hoje é {data_faro} em Faro, Portugal.'
    
    # Perguntas sobre voluntariado
    if any(word in question_lower for word in ['voluntariado', 'voluntário', 'ajudar', 'contribuir']):
        
        if any(phrase in question_lower for phrase in ['oportunidades', 'como posso']):
            return """Temos várias oportunidades de voluntariado em Faro, incluindo:
            
- Limpeza da Praia de Faro (Ambiente Faro)
- Festival de Artes para Crianças (Associação Cultural de Faro)
- Apoio ao Centro de Idosos (Centro Social Sénior de Faro)
- Distribuição de Alimentos (Banco Alimentar de Faro)

Você pode encontrar mais detalhes e se inscrever na seção de Voluntariado do nosso site."""
        
        if any(phrase in question_lower for phrase in ['benefícios', 'por que']):
            return """O voluntariado traz diversos benefícios:

1. Contribui para o bem-estar da comunidade
2. Permite conhecer novas pessoas e expandir sua rede de contatos
3. Desenvolve novas habilidades e experiências
4. Proporciona satisfação pessoal ao ajudar os outros

Em Faro, valorizamos muito a participação dos voluntários em diversas iniciativas comunitárias."""
        
        return "O LigaFaro oferece diversas oportunidades de voluntariado em áreas como ambiente, cultura, apoio social e distribuição de alimentos. Visite a seção de Voluntariado no nosso site para conhecer todas as oportunidades disponíveis e como se inscrever."
    
    # Perguntas sobre comunidade
    if any(word in question_lower for word in ['comunidade', 'membros', 'pessoas', 'conectar']):
        
        if any(phrase in question_lower for phrase in ['como participar', 'como fazer parte']):
            return """Para participar da comunidade LigaFaro, você pode:

1. Criar um perfil na nossa plataforma
2. Participar dos eventos locais
3. Contribuir no fórum comunitário
4. Inscrever-se em oportunidades de voluntariado
5. Conectar-se com outros membros através da seção Comunidade"""
        
        if any(phrase in question_lower for phrase in ['benefícios', 'vantagens']):
            return """Fazer parte da comunidade LigaFaro oferece várias vantagens:

1. Acesso a informações locais relevantes
2. Oportunidades de networking com outros moradores
3. Participação em decisões comunitárias
4. Descontos em eventos e serviços locais
5. Sentimento de pertencimento e conexão com Faro"""
        
        return "A comunidade LigaFaro é formada por diversos membros locais, incluindo líderes comunitários, donos de negócios, artistas, estudantes, professores e muito mais. Na seção Comunidade do nosso site, você pode conhecer e se conectar com outros membros que compartilham interesses semelhantes."
    
    # Resposta padrão
    return f"Posso ajudar com informações sobre eventos em Faro, notícias locais, voluntariado, comunidade ou sobre o LigaFaro. Temos {len(events)} eventos e {len(news)} notícias disponíveis. Também posso informar sobre o tempo atual e a data em Faro."

if __name__ == "__main__":
    # Receber a pergunta como argumento
    if len(sys.argv) > 1:
        question = sys.argv[1]
        response = process_question(question)
        print(json.dumps({"answer": response}))
    else:
        print(json.dumps({"error": "Nenhuma pergunta fornecida"}))