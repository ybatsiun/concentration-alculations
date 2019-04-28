import sys
import services.parsingService as parsingService
from services.loggerService import log

log('parsing equations: ' + sys.argv[1])
equationData = parsingService.getEquations( sys.argv[1].split(','))

log(equationData,True)