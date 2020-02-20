package resolvers

import (
	"github.com/monarkatfactly/dega-api-go.git/graph/generated"
)

// Resolver query
type Resolver struct{}

// Query resolver
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
